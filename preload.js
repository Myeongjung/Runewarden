/**
 * Runewarden — Electron Preload Script
 *
 * contextIsolation=true 환경에서 renderer에 안전하게 API를 노출합니다.
 * Node.js/Electron API를 직접 renderer에서 사용하지 않고
 * 이 파일을 통해 필요한 기능만 선택적으로 공개합니다.
 */

const { contextBridge, ipcRenderer } = require('electron');

// ── renderer에 노출할 API ─────────────────────────────
contextBridge.exposeInMainWorld('electronAPI', {
  // 앱 버전
  getVersion: () => ipcRenderer.invoke('get-version'),

  // 개발 모드 여부
  isDev: () => ipcRenderer.invoke('is-dev'),

  // 전체화면 토글
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),

  // 플랫폼 정보
  platform: process.platform,

  // 저장 경로 (Cloud Save 향후 구현용)
  getSavePath: () => ipcRenderer.invoke('get-save-path'),
});

// ── Steam API 브릿지 ─────────────────────────────────
contextBridge.exposeInMainWorld('steamAPI', {
  /** Steam 사용 가능 여부 (main에서 초기화 성공 시 true) */
  isAvailable: () => ipcRenderer.invoke('steam-is-available'),

  /** 로그인된 Steam 플레이어 이름 */
  getPlayerName: () => ipcRenderer.invoke('steam-get-player-name'),

  /** 업적 언락 — id: ACHIEVEMENTS 키 */
  unlockAchievement: (id) => ipcRenderer.invoke('steam-unlock-achievement', id),

  /** 정수 통계 설정 (kills, wins 등) */
  setStat: (name, value) => ipcRenderer.invoke('steam-set-stat', name, value),

  /** 정수 통계 조회 */
  getStat: (name) => ipcRenderer.invoke('steam-get-stat', name),
});

console.log('[Preload] Runewarden APIs exposed to renderer');
