// 런타임 공유 상태 — HUDUpdater·UIOrchestrator·GameEngine이 모두 이 객체를 통해 상태 접근
// 프로퍼티 값은 GameEngine.js에서 초기화·갱신됨
export const shared = {
  // ── 런 개별 시스템 (startRun 시 교체) ──────────────
  state:      null,
  renderer:   null,
  enemySystem: null,
  towerSystem: null,
  cardSystem:  null,
  shopUI:      null,
  nodeUI:      null,
  eventUI:     null,
  restUI:      null,
  summaryUI:   null,
  relicUI:     null,
  tutorial:    null,
  rafId:       null,
  lastTime:    0,
  gameSpeed:   1,

  // ── 앱 싱글턴 (init 시 1회 할당) ──────────────────
  meta:    null,
  steam:   null,
  screens: null,

  // ── 선택 상태 ──────────────────────────────────────
  selectedWarden:     null,
  selectedDifficulty: null,
  selectedAscension:  0,
  selectedChallenges: [],
  _savedRunData:      null,
  _lastHandKey:       '',
  _bgmStarted:        false,

  // ── 런타임 상수 (DLC에 따라 변동) ─────────────────
  maxWaves:   15,
  bossWaves:  null,  // Set<number>

  // ── 교차 모듈 콜백 슬롯 ────────────────────────────
  onCardClick: null,  // HUDUpdater.renderHand() → GameEngine.onCardClick
  startRun:    null,  // UIOrchestrator → GameEngine.startRun
};
