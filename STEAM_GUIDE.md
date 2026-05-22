# Runewarden — Steam 출시 준비 가이드

## 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Electron 래핑 | ✅ 완료 | v42.1.0 |
| 게임 실행 | ✅ 완료 | `npm start` |
| 빌드 설정 | ✅ 완료 | electron-builder |
| Steam 업적 구조 | ✅ 완료 | 20개 정의 |
| Steam Deck CSS | ✅ 완료 | @media 1280px/800px |
| Steamworks SDK | ⏳ 미통합 | 아래 단계 참고 |
| Steam 앱 ID | ⏳ 미확정 | 개발 테스트용 480 사용 중 |
| DLC 기술 기반 | ✅ 완료 | `src/dlc/shadow_realm/` |
| DLC App ID | ⏳ 미등록 | 기본 게임 App ID 취득 후 진행 |

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

현재 정의된 업적 20개:
- FIRST_RUN, FIRST_WIN, FIRST_WAVE
- KILL_100, KILL_1000, TANK_KILLER, BOSS_KILLER, PERFECT_WAVE, ELITE_HUNTER
- BIG_DECK, TRIPLE_AUGMENT, SPELL_POWER, ALL_TOWERS
- RANK_5, RANK_10, RANK_20
- CURSED_WIN, PERFECT_RUN, SPEED_RUN, NEXUS_HEAL

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

## 키보드 단축키

### 메인 메뉴
| 키 | 동작 |
|----|------|
| `Enter` | 새 게임 시작 |
| `C` | 이어하기 (저장 있을 때) |
| `Esc` | 워든 선택 창 닫기 |

### 게임 중 — 준비 단계 (pre)
| 키 | 동작 |
|----|------|
| `Space` | 웨이브 시작 |
| `1` ~ `5` | 손패 카드 선택 |
| `F` | 선택 카드 취소 |
| `Esc` | 일시정지 |

### 게임 중 — 웨이브 진행 (wave)
| 키 | 동작 |
|----|------|
| `1` ~ `5` | 손패 카드 선택 / 주문 즉시 사용 |
| `F` | 선택 카드 취소 |
| `Tab` | 게임 속도 1× / 2× 토글 |
| `Esc` | 일시정지 |

### 노드 선택
| 키 | 동작 |
|----|------|
| `1` | 상점 |
| `2` | 이벤트 |
| `3` | 휴식 |

### 상점
| 키 | 동작 |
|----|------|
| `1` ~ `3` | 해당 슬롯 카드 구매 |
| `R` | 리롤 |
| `L` / `Esc` | 상점 나가기 |

### 이벤트
| 키 | 동작 |
|----|------|
| `1` ~ `3` | 선택지 선택 |

### 휴식 (Rest Site)
| 키 | 동작 |
|----|------|
| `1` | 카드 제거 |
| `2` | 골드 채집 |
| `Esc` | 나가기 |

### 일시정지
| 키 | 동작 |
|----|------|
| `Esc` | 재개 |
| `M` | 음소거 토글 |
| `Q` | 메인 메뉴로 나가기 |

### 게임 종료 / 결산
| 키 | 동작 |
|----|------|
| `R` | 다시 시작 |
| `M` | 메인 메뉴 |

---

## 개발 명령어 빠른 참조

| 명령어 | 설명 |
|--------|------|
| `npm start` | 프로덕션 모드로 실행 |
| `npm run dev` | 개발 모드 (DevTools + 자동 새로고침) |
| `npm run build:win` | Windows 인스톨러 빌드 |
| `node server.js` | 브라우저 개발 서버 (port 3457) |

---

## DLC 등록 및 구분 방법 (Steam 공식 기준)

### Steam에서 DLC가 기본 게임과 구분되는 방식

```
기본 게임 App ID: 예) 1234567   (game)
DLC App ID:       예) 1234568   (dlc, 기본 게임에 종속)
```

Steam 스토어/클라이언트에서의 표현:
- DLC는 **기본 게임 페이지 내 "이 게임의 DLC" 섹션**에 표시
- 사용자 라이브러리에서는 기본 게임 하나로만 보임
- 기본 게임 프로퍼티 → DLC 탭에서 설치/제거 가능

### DLC App ID 등록 절차

1. [partner.steamgames.com](https://partner.steamgames.com) 접속
2. 기본 게임 앱 선택 → **Edit Steamworks Settings**
3. **All Associated Packages, DLC, Demos And Tools** 탭
4. **Add New DLC** 클릭
5. DLC 이름 입력 (예: `Runewarden: Shadow Realm`)
6. → **새 App ID 자동 발급** (예: 1234568)
7. `src/systems/SteamSystem.js`의 `DLC_DEFS.shadow_realm.steamAppId`에 입력
8. Steamworks에서 DLC 스토어 페이지 작성 (설명, 스크린샷, 가격)

### 게임 내 DLC 소유 여부 확인 API

Steam의 `ISteamApps` 인터페이스 기준 (steamworks.js 래핑):

| API | 용도 | 반환 |
|-----|------|------|
| `BIsDlcInstalled(appId)` | DLC 소유 + 설치 여부 | bool |
| `BIsSubscribedApp(appId)` | DLC 소유 여부만 | bool |
| `GetDLCCount()` | 등록된 DLC 총 개수 | int (최대 64) |
| `BGetDLCDataByIndex(i)` | 인덱스로 DLC 메타데이터 조회 | {appId, name, available} |

**Runewarden 구현 위치**: `src/systems/SteamSystem.js` → `isDlcOwned(dlcKey)`

```js
// 사용 예시 (GameEngine.js)
const hasShadowRealm = steam?.isDlcOwned('shadow_realm') ?? false;
```

### DLC 배포 방식 선택

| 방식 | 장점 | 단점 | Runewarden 선택 |
|------|------|------|----------------|
| **기본 게임에 포함 + API 잠금** | 배포 간단, 별도 다운로드 없음 | 미구매자도 파일 보유 | ✅ **이 방식** |
| **별도 Depot으로 분리** | 미구매자 파일 없음 | 배포 복잡, 추가 설정 필요 | ❌ |

→ `src/**/*` 와일드카드로 DLC 파일 자동 포함, Steam API로 잠금/해제

### DLC 패키지 구성 (Steamworks)

```
기본 게임 패키지 (Steam Store Package)
  └─ App: 1234567 (기본 게임)

DLC 패키지 (Steam Store Package)
  └─ App: 1234568 (Shadow Realm DLC)

번들 (Bundle) — 선택사항
  └─ 기본 게임 + Shadow Realm DLC = $13.99 (기본 $9.99 + DLC $4.99 → 17% 할인)
```

### DLC 테스트 (App ID 없이)

```js
// 브라우저 콘솔에서 실행 → 새로고침
localStorage.setItem('rw_dev', '1')           // 모든 DLC 활성화
localStorage.setItem('rw_dlc_owned', '["shadow_realm"]')  // 특정 DLC만 활성화
```
