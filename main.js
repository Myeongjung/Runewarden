/**
 * Runewarden — Electron Main Process
 *
 * 역할:
 * - BrowserWindow 생성 및 게임 HTML 로드
 * - 창 크기/전체화면 관리
 * - Steam Deck 호환 (1280×800)
 * - Steamworks SDK 초기화 (향후 통합)
 * - 앱 생명주기 관리
 */

const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path  = require('path');
const fs    = require('fs');

// ── 개발 모드 감지 ──────────────────────────────────────
const isDev = process.argv.includes('--dev') ||
              process.env.NODE_ENV === 'development';

// ── Steam 앱 ID 설정 (빌드 시 자동 배치됨) ────────────
const STEAM_APP_ID = '480'; // 개발용 SpaceWar 테스트 ID → 출시 시 교체

// ── 창 상태 저장 ──────────────────────────────────────
let mainWindow = null;

// ── Steamworks 초기화 ────────────────────────────────
function initSteam() {
  try {
    const steamworks = require('steamworks.js');
    const client     = steamworks.init(parseInt(STEAM_APP_ID));
    global.steamClient = client;

    const name = client.localplayer.getName();
    const sid  = client.localplayer.getSteamId().steamId64;
    console.log(`[Steam] ✅ Initialized — User: ${name} (${sid})`);

    // Steam Overlay 활성화
    client.overlay?.activateGameOverlay?.('Achievements');

    // IPC: 플레이어 이름
    ipcMain.handle('steam-get-player-name', () => name);

    // IPC: 업적 언락
    ipcMain.handle('steam-unlock-achievement', (_, id) => {
      try {
        client.achievement.activate(id);
        console.log(`[Steam] Achievement unlocked: ${id}`);
        return true;
      } catch (e) {
        console.warn('[Steam] Achievement error:', e.message);
        return false;
      }
    });

    // IPC: 통계 설정 (정수)
    ipcMain.handle('steam-set-stat', (_, name, value) => {
      try {
        client.stats.setInt(name, value);
        client.stats.store();
        return true;
      } catch (e) {
        console.warn('[Steam] SetStat error:', e.message);
        return false;
      }
    });

    // IPC: 통계 조회
    ipcMain.handle('steam-get-stat', (_, name) => {
      try { return client.stats.getInt(name); }
      catch { return 0; }
    });

    // IPC: 가용 여부
    ipcMain.handle('steam-is-available', () => true);

    // 앱 종료 시 Steam 클린업
    app.on('before-quit', () => {
      try { client.stats.store(); steamworks.shutdown(); }
      catch {}
    });

    return true;
  } catch (e) {
    console.warn('[Steam] Could not initialize Steamworks:', e.message);
    console.log('[Steam] Running with localStorage fallback.');

    // 폴백 핸들러 (Steam 없이도 앱이 동작)
    ipcMain.handle('steam-is-available',      () => false);
    ipcMain.handle('steam-get-player-name',   () => 'Warden');
    ipcMain.handle('steam-unlock-achievement', () => false);
    ipcMain.handle('steam-set-stat',          () => false);
    ipcMain.handle('steam-get-stat',          () => 0);
    return false;
  }
}

// ── 게임 창 생성 ─────────────────────────────────────
function createWindow() {
  // Steam Deck 해상도 대응: 기본 1280×720, 최소 1024×600
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = primaryDisplay.workAreaSize;

  // 화면이 충분히 크면 더 큰 창으로 시작
  const winW = Math.min(1280, screenW);
  const winH = Math.min(720, screenH);

  mainWindow = new BrowserWindow({
    width:  winW,
    height: winH,
    minWidth:  1024,
    minHeight: 600,
    title: 'Runewarden',
    backgroundColor: '#1A1A2E',   // 로딩 중 배경색 (FOUC 방지)
    show: false,                   // 준비 완료 후 표시
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,      // 보안: renderer와 main 격리
      nodeIntegration: false,      // 보안: renderer에서 Node.js 비활성화
      webSecurity: !isDev,         // 개발 시 CORS 완화
      devTools: isDev,
    },
    // 창 프레임 스타일
    frame: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  // ── HTML 로드 ────────────────────────────────────────
  mainWindow.loadFile('index.html');

  // ── 준비 완료 시 창 표시 (깜빡임 방지) ───────────────
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  // ── 메뉴 설정 ────────────────────────────────────────
  buildMenu();

  // ── 전체화면 토글 (F11) ───────────────────────────────
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
    // 개발 모드: F5 새로고침, F12 개발자 도구
    if (isDev) {
      if (input.key === 'F5' && input.type === 'keyDown') {
        mainWindow.webContents.reload();
      }
      if (input.key === 'F12' && input.type === 'keyDown') {
        mainWindow.webContents.toggleDevTools();
      }
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── 앱 메뉴 빌드 ─────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'Runewarden',
      submenu: [
        {
          label: 'New Run',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.executeJavaScript(
            'document.getElementById("btn-start")?.click()'
          ),
        },
        { type: 'separator' },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quit Runewarden' },
      ],
    },
    ...(isDev ? [{
      label: 'Dev',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Open Meta Reset',
          click: () => mainWindow?.webContents.executeJavaScript(
            'window.__dev?.metaReset()'
          ),
        },
      ],
    }] : []),
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── IPC 핸들러 (renderer ↔ main 통신) ────────────────
ipcMain.handle('get-version',    () => app.getVersion());
ipcMain.handle('get-app-path',   () => app.getPath('userData'));
ipcMain.handle('is-dev',         () => isDev);
ipcMain.handle('toggle-fullscreen', () => {
  const fs = mainWindow?.isFullScreen();
  mainWindow?.setFullScreen(!fs);
  return !fs;
});

// Steam Cloud Save 용 경로 (향후 구현)
ipcMain.handle('get-save-path', () => {
  return path.join(app.getPath('userData'), 'saves');
});

// ── 앱 생명주기 ───────────────────────────────────────
app.whenReady().then(() => {
  // Steam 초기화 (실패해도 게임 실행 계속)
  initSteam();
  createWindow();

  // macOS: 독 클릭 시 창 재생성
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Windows/Linux: 모든 창 닫히면 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 외부 링크 기본 브라우저에서 열기
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

console.log(`[Runewarden] v${app.getVersion()} starting... (${isDev ? 'DEV' : 'PROD'})`);
