# Runewarden — Steam 출시 준비 가이드

## 현재 상태 (Phase 1)

| 항목 | 상태 | 비고 |
|------|------|------|
| Electron 래핑 | ✅ 완료 | v42.1.0 |
| 게임 실행 | ✅ 완료 | `npm start` |
| 빌드 설정 | ✅ 완료 | electron-builder |
| Steam 업적 구조 | ✅ 완료 | 16개 정의 |
| Steamworks SDK | ⏳ 미통합 | 아래 단계 참고 |
| 아이콘 파일 | ⏳ 미완성 | assets/ 폴더에 추가 필요 |
| Steam 앱 ID | ⏳ 미확정 | 개발 테스트용 480 사용 중 |

---

## 1단계: Electron으로 게임 실행

```bash
# 개발 모드 (DevTools 포함)
npm run dev

# 프로덕션 모드
npm start

# Windows 빌드
npm run build:win
```

---

## 2단계: Steamworks SDK 통합

```bash
# steamworks.js 설치
npm install steamworks.js

# main.js에서 주석 해제:
# const steamworks = require('steamworks.js');
# const client = steamworks.init(YOUR_APP_ID);
```

`steam_appid.txt`를 실제 Steam 앱 ID로 교체하세요.

---

## 3단계: 아이콘 준비

```
assets/
├── icon.ico   (Windows, 256×256)
├── icon.icns  (macOS)
└── icon.png   (Linux, 512×512)
```

권장 도구: [Image Magick](https://imagemagick.org/) 또는 [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)

```bash
# SVG → PNG 변환 후 각 플랫폼별 아이콘 생성
npx electron-icon-builder --input=assets/icon.png --output=assets/
```

---

## 4단계: Steam 앱 페이지 등록

1. [Steamworks](https://partner.steamgames.com/) 가입 ($108 등록비)
2. 새 앱 생성 → 앱 ID 발급
3. `steam_appid.txt`에 발급받은 앱 ID 입력
4. `main.js`의 `STEAM_APP_ID` 상수 업데이트

---

## 5단계: Steam 업적 등록

`src/systems/SteamSystem.js`의 `ACHIEVEMENTS` 객체를 기반으로
Steamworks 파트너 대시보드에서 업적을 등록하세요.

현재 정의된 업적 16개:
- FIRST_RUN, FIRST_WIN, FIRST_WAVE
- KILL_100, KILL_1000, TANK_KILLER, PERFECT_WAVE
- BIG_DECK, TRIPLE_AUGMENT, SPELL_POWER
- RANK_5, RANK_10, RANK_20
- CURSED_WIN, PERFECT_RUN, SPEED_RUN

---

## 6단계: Steam Deck 인증 체크리스트

- [x] 1280×800 해상도 지원
- [x] 마우스만으로 완전 플레이 가능
- [ ] 게임패드 지원 (향후)
- [ ] Steam Deck에서 실제 테스트

---

## 7단계: 빌드 & 업로드

```bash
# 최종 Windows 빌드
npm run build:win

# dist/ 폴더에 생성된 파일을 Steamworks에 업로드
# Steamworks SDK의 SteamPipe 사용
```

---

## 출시 체크리스트

- [ ] 모든 웨이브 (1~3) 클리어 테스트
- [ ] 10종 이벤트 전부 테스트
- [ ] 메타 랭크 1~5 달성 테스트
- [ ] Steam 업적 Steamworks 대시보드에 등록
- [ ] Steam 페이지 작성 (설명, 스크린샷 5장, 트레일러)
- [ ] 스토어 태그: Roguelike, Deck Building, Tower Defense, Strategy
- [ ] 가격 설정: $9.99 (권장)
- [ ] Steam Deck 인증 제출

---

## 개발 명령어 빠른 참조

| 명령어 | 설명 |
|--------|------|
| `npm start` | 프로덕션 모드로 실행 |
| `npm run dev` | 개발 모드 (DevTools + 자동 새로고침) |
| `npm run build:win` | Windows 인스톨러 빌드 |
| `node server.js` | 브라우저 개발 서버 (port 3457) |
