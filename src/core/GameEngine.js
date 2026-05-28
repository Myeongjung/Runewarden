/* eslint-disable max-lines-per-function, no-unused-vars, prefer-const */
// Runewarden — GameEngine
// TODO: 이 파일은 점진적 리팩토링 대상. SpellResolver 분리 완료 후 suppress 제거 예정.
import { MapRenderer, isPlaceableCell, hexToPixel } from '../rendering/MapRenderer.js';
import { EnemySystem } from '../systems/EnemySystem.js';
import { TowerSystem } from '../systems/TowerSystem.js';
import { CardSystem }  from '../systems/CardSystem.js';
import { ShopUI }      from '../ui/ShopUI.js';
import { NodeSelectionUI, EventUI, RestUI, pickRandomCards } from '../ui/NodeUI.js';
import { MetaSystem, CODEX_UNLOCKS, xpForLevel, MAX_RANK } from '../systems/MetaSystem.js';
import { RunSummaryUI } from '../ui/RunSummaryUI.js';
import { buildStarterDeck, CARD_DEFS } from '../data/cards.js';
import { WARDEN_DEFS, getWardenById, PASSIVES } from '../data/wardens.js';
import { TOWER_DEFS } from '../data/towers.js';
import { SteamSystem, STEAM_STATS } from '../systems/SteamSystem.js';
import { TutorialUI }   from '../ui/TutorialUI.js';
import { audio, music }  from '../systems/AudioSystem.js';
import { i18n }          from '../i18n/i18n.js';
import { RelicUI }       from '../ui/RelicUI.js';
import { pickRandomRelics, RELIC_DEFS } from '../data/relics.js';
import { pickRandomMap, getMapById }   from '../data/maps.js';
import { setActiveMap }     from '../rendering/MapRenderer.js';
import { DIFFICULTY_DEFS, getDifficultyById } from '../data/difficulty.js';
import { ASCENSION_DEFS, getAscensionMods }   from '../data/ascension.js';
import { CHALLENGE_DEFS, getChallengeXPBonus, getChallengeMods } from '../data/challenges.js';
import { resolveSpell as _resolveSpellImpl } from './SpellResolver.js';
import { HEX_W } from '../config/constants.js';
import { log, spawnFloatText, shakeNexus, setWaveButton } from './GameUtils.js';
import { shared } from './GameState.js';
import { updateHUD, renderHand, onBossUpdate, updateShadowChargeHUD, showClearBanner, updateMenuRank } from '../ui/HUDUpdater.js';
import { showScreen, openWardenSelect, openDifficultySelect, openCodex, openDeckView } from '../ui/UIOrchestrator.js';
import { registerDLC, hasDLC, clearDLCs } from '../systems/DLCRegistry.js';

function rangeToPixel(hexRange) { return hexRange * HEX_W * 0.75; }

// ── 상수 ──────────────────────────────────────────────
const MAX_WAVES_BASE  = 15;  // Act 1(5) + Act 2(5) + Act 3(5)
const MAX_WAVES_DLC   = 23;  // + Act 4(8) — DLC Shadow Realm
const MAX_WAVES_DLC2  = 31;  // + Act 5(8) — DLC Solar Dominion
const ACT_SIZE    = 5;   // 액트당 웨이브 수
const NEXUS_HP    = 3;
const START_GOLD  = 25;
const WAVE_GOLD   = 8;
const BOSS_WAVES_BASE = new Set([5, 10, 15]);
const BOSS_WAVES_DLC  = new Set([5, 10, 15, 23]);       // DLC1 보스 웨이브
const BOSS_WAVES_DLC2 = new Set([5, 10, 15, 23, 31]);   // DLC2 보스 웨이브 (Solar Titan: W28도 특수)
const CURSED_WAVES    = new Set([4, 9, 14, 20, 27]);     // 저주 웨이브 고정 시점 (Act당 1회)

// ── DOM 참조 ───────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── 앱 싱글턴 + 공유 상태 초기화 ─────────────────────
const meta  = new MetaSystem();
const steam = new SteamSystem();

shared.meta    = meta;
shared.steam   = steam;
shared.screens = {
  menu:     $('screen-menu'),
  game:     $('screen-game'),
  howto:    $('screen-howto'),
  gameover: $('screen-gameover'),
};
shared.selectedWarden     = WARDEN_DEFS[0];
shared.selectedDifficulty = getDifficultyById('standard');
shared.bossWaves          = new Set([5, 10, 15]);
shared.maxWaves           = 15;

// ── 런 시스템 레퍼런스 (startRun 시 교체 — shared에서 접근) ─
// 이 모듈 스코프 변수들은 내부 클로저에서 편의상 유지됨
let state       = null;
let renderer    = null;
let enemySystem = null;
let towerSystem = null;
let cardSystem  = null;
let shopUI      = null;
let nodeUI      = null;
let eventUI     = null;
let restUI      = null;
let summaryUI   = null;
let relicUI     = null;

// 튜토리얼 (런 시작 후 생성)
let tutorial   = null;
let rafId = null;
let lastTime = 0;
let gameSpeed = 1;   // 1 = 1×, 2 = 2× (웨이브 중에만 적용)

// ── QW#3: 히트스톱 ────────────────────────────────────
// 연속 처치(스플래시) 시 중첩 방지: 복원할 속도를 별도 저장
let _hitStopTargetSpeed = 1;
let _hitStopTimer       = null;
function hitStop(ms) {
  if (!_hitStopTimer) _hitStopTargetSpeed = gameSpeed;
  clearTimeout(_hitStopTimer);
  gameSpeed = 0;
  _hitStopTimer = setTimeout(() => {
    gameSpeed = _hitStopTargetSpeed;
    _hitStopTimer = null;
  }, ms);
}

// ── 일시정지 / 재개 ───────────────────────────────────
function pauseGame() {
  if (!state || state.phase === 'over' || state.phase === 'paused') return;
  if (!shared.screens.game.classList.contains('active')) return;

  state._prevPhase = state.phase;
  state.phase = 'paused';

  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

  // BGM 볼륨 절반으로 낮춤 (AudioContext는 suspend하지 않음 — SFX 유지)
  music.setVolume(0.08);
  $('screen-pause').classList.remove('hidden');
}

function resumeGame() {
  if (!state || state.phase !== 'paused') return;

  state.phase = state._prevPhase ?? 'pre';
  delete state._prevPhase;

  music.setVolume(audio.getBGMVolume());   // BGM 볼륨 복원
  $('screen-pause').classList.add('hidden');

  lastTime = performance.now();
  rafId = requestAnimationFrame(gameLoop);
}

// ── 게임 속도 ─────────────────────────────────────────
function toggleGameSpeed() {
  gameSpeed = gameSpeed === 1 ? 2 : 1;
  _updateSpeedBtn();
}

function resetGameSpeed() {
  gameSpeed = 1;
  _updateSpeedBtn();
}

function _updateSpeedBtn() {
  const btn = $('btn-speed');
  if (!btn) return;
  btn.textContent = gameSpeed === 2 ? '2×' : '1×';
  btn.classList.toggle('speed-active', gameSpeed === 2);
}






// ── 자동저장 ──────────────────────────────────────────
function saveCheckpoint() {
  if (!state || !cardSystem || !towerSystem || state.phase === 'over') return;
  try {
    const deck = [...cardSystem.drawPile, ...cardSystem.discardPile].map(c => c.id);
    const towers = [...towerSystem.towers.values()].map(t => ({
      col: t.col, row: t.row,
      towerId: t.def.id,
      augments: t.augments.map(a => JSON.parse(JSON.stringify(a))),
    }));
    const cp = {
      v: 2, ts: Date.now(),
      wardenId: state.warden.id,
      diffId:   state.difficulty.id,
      mapId:    state.mapId,
      mapName:  state.mapName,
      mapIcon:  state.mapIcon,
      asc:      state.ascension,
      wave:     state.wave,
      gold:     state.gold,
      nexusHp:  state.nexusHp,
      maxNexusHp: state.maxNexusHp,
      relicIds: state.relics.map(r => r.id),
      deck, towers,
      stats: { ...state.stats, towerTypesUsed: [...state.stats.towerTypesUsed] },
    };
    localStorage.setItem('rw_autosave', JSON.stringify(cp));
  } catch(e) { console.warn('[AutoSave] Failed:', e.message); }
}

function _restoreFromSave(save) {
  // 버전·필수 필드 검증 — 손상 세이브 조기 차단
  const required = ['v', 'wave', 'gold', 'nexusHp', 'deck', 'towers', 'wardenId', 'diffId'];
  const missing  = required.filter(f => save?.[f] === undefined || save?.[f] === null);
  if (!save?.v || save.v < 2 || missing.length > 0) {
    console.warn('[AutoSave] Invalid save — missing:', missing);
    log('⚠️ 저장 데이터 손상 — 이전 체크포인트를 사용할 수 없습니다.', 'bad');
    localStorage.removeItem('rw_autosave');
    setTimeout(() => _openRelicPicker(), 600);
    return;
  }
  try {
    state.wave       = Math.max(0, Math.min(shared.maxWaves, save.wave));
    state.gold       = Math.max(0, save.gold);
    state.nexusHp    = Math.max(1, Math.min(save.maxNexusHp ?? save.nexusHp, save.nexusHp));
    state.maxNexusHp = Math.max(1, save.maxNexusHp ?? state.maxNexusHp);
    state.stats = { ...save.stats, towerTypesUsed: new Set(save.stats.towerTypesUsed) };

    // 유물 복원
    state.relics = save.relicIds.map(id => RELIC_DEFS.find(r => r.id === id)).filter(Boolean);
    relicUI.updateHUD(state.relics);
    for (const r of state.relics) {
      _applyRelicToTowers(r);
      if (r.effect.type === 'card_draw_bonus') {
        cardSystem.bonusHandSize = (cardSystem.bonusHandSize || 0) + r.effect.amount;
      }
    }

    // 덱 복원
    cardSystem.drawPile = save.deck
      .map(id => { const d = CARD_DEFS.find(c => c.id === id); return d ? { ...d, uid: Math.random() } : null; })
      .filter(Boolean);
    cardSystem.discardPile = [];
    cardSystem.hand = [];
    cardSystem.drawHand();
    renderHand();

    // 타워 복원
    for (const t of save.towers) {
      const tDef = TOWER_DEFS[t.towerId];
      if (!tDef) continue;
      towerSystem.place(t.col, t.row, tDef);
      renderer.placeTower(t.col, t.row, tDef);
      for (const aug of (t.augments ?? [])) towerSystem.augment(t.col, t.row, aug);
      if (t.augments?.length > 0) renderer.markAugmented(t.col, t.row, tDef, t.augments.length);
    }

    updateHUD();
    log(i18n.t('autosave_loaded', save.wave), 'good');
    audio.play('wave_clear');
    setTimeout(() => openNodeSelection(), 600);
  } catch(err) {
    console.error('[AutoSave] Restore failed:', err);
    log('⚠️ 저장 데이터 손상 — 새 런을 시작합니다.', 'bad');
    localStorage.removeItem('rw_autosave');
    setTimeout(() => _openRelicPicker(), 600);
  }
}

// ── 런 초기화 ─────────────────────────────────────────
function startRun() {
  // 모든 오버레이 즉시 강제 닫기
  ['screen-summary','screen-node','screen-shop',
   'screen-event','screen-rest','screen-howto','screen-gameover','screen-pause',
   'screen-warden-select','screen-relic','screen-difficulty',
  ].forEach(id => $(id)?.classList.add('hidden'));

  // 핸드 dirty-flag 초기화 (새 런 강제 리렌더)
  shared._lastHandKey = '';
  // 이전 런 정리
  if (rafId) cancelAnimationFrame(rafId);

  // DLC 상태에 따라 최대 웨이브 / 보스 웨이브 결정 (DLC2 > DLC1 > base)
  clearDLCs();
  if (steam?.isDlcOwned('shadow_realm'))    registerDLC('shadow_realm');
  if (steam?.isDlcOwned('solar_dominion'))  registerDLC('solar_dominion');
  if (hasDLC('solar_dominion')) {
    shared.maxWaves  = MAX_WAVES_DLC2;
    shared.bossWaves = BOSS_WAVES_DLC2;
  } else if (hasDLC('shadow_realm')) {
    shared.maxWaves  = MAX_WAVES_DLC;
    shared.bossWaves = BOSS_WAVES_DLC;
  } else {
    shared.maxWaves  = MAX_WAVES_BASE;
    shared.bossWaves = BOSS_WAVES_BASE;
  }

  // Warden + 난이도 기반 시작 조건
  const bonuses    = meta.bonuses;
  const warden     = shared.selectedWarden;
  const diff       = shared.selectedDifficulty;
  const initGold   = Math.max(0, warden.startGold + (bonuses.startGold || 0) + diff.goldBonus);
  const initNexus  = Math.max(1, warden.nexusHp + (bonuses.nexusHp || 0) + diff.nexusHp);

  const ascMods       = getAscensionMods(shared.selectedAscension);
  const challengeMods = getChallengeMods(shared.selectedChallenges);

  // 챌린지 poverty: 시작 골드 오버라이드
  const finalGold = challengeMods.startGold !== null
    ? challengeMods.startGold
    : initGold;

  state = {
    wave:        0,
    nexusHp:     initNexus,
    maxNexusHp:  initNexus,      // 이번 런 넥서스 최대 HP (heal 상한선)
    gold:        finalGold,
    difficulty:  diff,           // 런 내 난이도 참조
    ascension:   shared.selectedAscension,  // 런 내 Ascension 레벨
    challenges:     [...shared.selectedChallenges],
    challengeMods,
    ascMods,                     // 누적 핸디캡 mods
    phase:       'pre',
    selectedCard: null,
    warden:      warden,          // 런 내 Warden 참조
    relics:      [],              // 이번 런 보유 유물
    _soulAnchorUsed:       false,  // Soul Anchor 1회용 사용 여부
    _nexusHitThisWave:     false,  // 이번 웨이브 넥서스 피격 여부 (PERFECT_WAVE 업적)
    _acceptedCurse:        false,  // cursed_gold 이벤트 수락 여부 (CURSED_WIN 업적)
    lastSpellEffect:       null,   // Void Echo: 마지막 시전 스펠 효과 추적
    // DLC 2 Solar Charge 상태
    _solarChargeCount:     0,
    _solarChargeMax:       8,
    _solarChargeExtraOnHighCost: 0,
    _divineShieldActive:   false,
    _divineShieldExpiry:   0,
    _investGoldReturn:     0,      // invest_gold 이벤트 저장 (다음 웨이브 클리어 시 지급)
    _tempDmgBonusWaves:    0,      // temp_dmg_bonus 잔여 웨이브 수
    _tempDmgBonusMult:     1,      // temp_dmg_bonus 배율
    _victoryStreakWaves:    0,      // 승전 보너스 잔여 웨이브 수
    _victoryStreakBonus:    0,      // 승전 보너스 1회 지급 골드
    _cursedWave:           null,   // 현재 저주 웨이브 타입: 'speed' | 'hand' | 'revive' | null
    // 런 통계
    stats: {
      enemiesKilled:         0,
      enemiesKilledThisWave: 0,   // DLC: Death Toll 주문용 웨이브 처치 수
      goldEarned:            initGold,
      cardsPlayed:           0,
      eliteKills:            0,
      bossKilled:            false,
      nexusHealed:           false,
      augmentsApplied:       0,
      spellsThisWave:        0,
      maxSpellsInWave:       0,
      towerTypesUsed:        new Set(),
    },
    _runStartTime: Date.now(),
  };

  const handSizeBonus = bonuses.handSize || 0;
  const wardenDeck    = warden.buildDeck();   // Warden별 시작 덱

  // 시스템 초기화
  const svg = $('game-svg');
  svg.innerHTML = '';

  // 맵 선택 — 자동저장 복원 시 저장된 맵 사용, 그 외 랜덤
  const selectedMap = shared._savedRunData?.mapId
    ? (getMapById(shared._savedRunData.mapId) ?? pickRandomMap())
    : pickRandomMap();
  setActiveMap(selectedMap.path);
  state.mapId   = selectedMap.id;
  state.mapName = selectedMap.name;
  state.mapIcon = selectedMap.icon;

  renderer  = new MapRenderer(svg, onCellClick, onCellHover);
  cardSystem = new CardSystem(wardenDeck, warden.handSize + handSizeBonus);

  enemySystem = new EnemySystem(
    renderer.getEnemyLayer(),
    onEnemyReachEnd,
    onEnemyKilled,
    onBossUpdate,
  );
  enemySystem.onEnrageImminent = (e) => {
    if (e.isBoss) log(i18n.t('log_enrage_imminent', e.name || e.type), 'bad');
  };

  towerSystem = new TowerSystem(
    renderer.getProjectileLayer(),
    enemySystem,
    (msg, cls) => log(msg, cls),
  );

  // 요약 UI (매 런마다 재생성)
  summaryUI = new RunSummaryUI($('screen-summary'));

  // 노드 UI들 초기화 (매 런마다)
  nodeUI = new NodeSelectionUI($('screen-node'), {
    onShop:  openShop,
    onEvent: openEvent,
    onRest:  openRest,
  });

  shopUI = new ShopUI($('screen-shop'), {
    onBuy:   onShopBuy,
    onLeave: onShopLeave,
    onLog:   (msg, cls) => log(msg, cls),
  });

  eventUI = new EventUI($('screen-event'), {
    onEffect: onEventEffect,
    onClose:  onNodeClose,
    onLog:    (msg, cls) => log(msg, cls),
  });

  restUI = new RestUI($('screen-rest'), {
    onRemoveCard: onRestRemoveCard,
    onGoldBonus:  onRestGoldBonus,
    onClose:      onNodeClose,
    onLog:        (msg, cls) => log(msg, cls),
  });

  // RelicUI 초기화 (매 런마다)
  relicUI = new RelicUI($('screen-relic'), {
    onPick: (relic) => _applyRelicPicked(relic),
  });
  relicUI.initHUD($('hud'));

  shared.state      = state;
  shared.renderer   = renderer;
  shared.enemySystem = enemySystem;
  shared.towerSystem = towerSystem;
  shared.cardSystem  = cardSystem;
  shared.relicUI     = relicUI;

  // UI 초기화
  showScreen('game');
  shared.onCardClick = onCardClick;
  shared.startRun    = startRun;

  // 워든별 HUD CSS 테마 적용
  const hudEl = $('hud');
  const mapEl = $('map-area');
  if (hudEl)  hudEl.style.setProperty('--warden-color', warden.color);
  if (mapEl)  mapEl.style.setProperty('--warden-color', warden.color);

  updateHUD();
  cardSystem.drawHand();
  renderHand();
  setWaveButton(i18n.t('btn_start_wave'), false);
  log(`${warden.icon} ${i18n.t('log_run_start', warden.name)}`);
  log(`${selectedMap.icon} ${selectedMap.name}  ${diff.icon} ${i18n.t('log_difficulty', i18n.t('diff_' + diff.id))}`, 'gold');
  if (shared.selectedAscension > 0) log(i18n.t('log_ascension', shared.selectedAscension), 'bad');
  log(`Passive: ${i18n.t(warden.passiveKey)}`, 'gold');

  // 초보자 카드 타입 힌트 (첫 2런까지만 표시)
  if (meta.runsPlayed <= 1 && TutorialUI.isDone()) {
    const isKo = i18n.lang === 'ko';
    setTimeout(() => {
      log(isKo
        ? '💡 소환(타워 배치) · 강화(타워 업그레이드) · 주문(즉시 발동)'
        : '💡 Summon (place tower) · Augment (upgrade tower) · Spell (instant)', 'gold');
    }, 1800);
  }

  music.crossfadeTo('game');

  // 게임 루프 시작
  lastTime = performance.now();
  rafId = requestAnimationFrame(gameLoop);

  // ── 자동저장 복원 또는 유물 선택/튜토리얼 ─────────────
  if (shared._savedRunData) {
    const saveData = shared._savedRunData;
    shared._savedRunData = null;
    setTimeout(() => _restoreFromSave(saveData), 300);
  } else if (TutorialUI.isDone()) {
    setTimeout(() => _openRelicPicker(), 600);
  } else {
    if (tutorial && tutorial.isActive()) {
      // 이미 실행 중이면 건너뜀
    } else {
      setTimeout(() => startTutorial(), 800);
    }
  }
}

// ── 유물 선택 오픈 ────────────────────────────────────
function _openRelicPicker() {
  const existingIds = state.relics.map(r => r.id);
  const choices = pickRandomRelics(3, existingIds);
  if (choices.length === 0) return;  // 모두 획득한 경우
  relicUI.openPicker(choices);
}

// ── 유물 획득 처리 ────────────────────────────────────
function _applyRelicPicked(relic) {
  state.relics.push(relic);
  relicUI.updateHUD(state.relics);

  const name = i18n.t('relic_' + relic.id);
  log(i18n.t('log_relic_picked', name), 'gold');
  audio.play('shop_buy');

  // 즉시 적용 효과
  const e = relic.effect;
  switch (e.type) {
    case 'start_gold':
      addGold(e.amount, null, true);
      break;
    case 'nexus_hp_bonus':
      state.nexusHp += e.amount;
      updateHUD();
      break;
    case 'card_draw_bonus':
      // 다음 드로우부터 반영 (handSizeBonus 방식으로 CardSystem에 반영)
      cardSystem.bonusHandSize = (cardSystem.bonusHandSize || 0) + e.amount;
      break;
    case 'blood_price':
      // 넥서스 HP 1 희생, 즉시 골드 획득
      if (state.nexusHp > 1) {
        state.nexusHp -= e.hpCost;
        state.maxNexusHp = Math.max(1, (state.maxNexusHp ?? 1) - e.hpCost); // 최대값도 감소
        addGold(e.goldGain, null, true);
        updateHUD();
        log(i18n.t('log_blood_price', e.goldGain), 'gold');
      } else {
        // HP가 1이면 희생 불가 → 절반 골드만 지급
        const halfGold = Math.floor(e.goldGain / 2);
        addGold(halfGold, null, true);
        log(i18n.t('log_blood_price', halfGold), 'gold');
      }
      break;
  }

  // 타워 버프 즉시 적용 (배치된 타워에)
  _applyRelicToTowers(relic);
}

// ── 유물 효과: 타워/적 시스템 패치 ──────────────────────
function _applyRelicToTowers(relic) {
  const e = relic.effect;
  if (towerSystem) {
    switch (e.type) {
      case 'tower_dmg_bonus':
        towerSystem.addRelicDmgBonus(e.towerType, e.mult);
        break;
      case 'tower_range_bonus':
        towerSystem.addRelicRangeBonus(e.towerType, e.mult);
        break;
      case 'tower_speed_bonus':
        towerSystem.addRelicSpeedBonus(e.towerType, e.mult);
        break;
      case 'chain_bonus':
        towerSystem.addChainBonus(e.extra);
        break;
      case 'druid_aura_bonus':
        towerSystem.addDruidAuraBonus(e.extraMult);
        break;
      case 'siege_splash':
        towerSystem.addSiegeSplash(e.mult);
        break;
      case 'fire_pact':
        towerSystem.addFirePact(e.extraMult);
        break;
      // DLC 2 Solar cases
      case 'solar_pact':
        towerSystem.addSolarPact?.(e.extraMult, e.towerTag ?? 'Solar');
        break;
      case 'light_prism_bonus':
        towerSystem.addLightPrismBonus?.(e.extraDmg, e.extraRadius ?? 0);
        break;
      case 'crusader_stun_bonus':
        towerSystem.addCrusaderStunBonus?.(e.extraMs);
        break;
    }
  }
  if (enemySystem) {
    if (e.type === 'slow_bonus') {
      enemySystem.setSlowBonus(e.mult);
    }
    if (e.type === 'burn_bonus') {
      enemySystem.setBurnBonus(e.extraDps, e.extraDuration);
    }
    if (e.type === 'solar_dot_bonus') {
      enemySystem.setSolarDotBonus?.(e.extraDps, e.extraDuration);
    }
  }
  // State-level DLC 2 relic effects
  if (state) {
    if (e.type === 'solar_charge_reduce') {
      state._solarChargeMax = Math.min(state._solarChargeMax ?? 8, e.newMax);
    }
    if (e.type === 'solar_charge_on_spell') {
      state._solarChargeExtraOnHighCost = (state._solarChargeExtraOnHighCost ?? 0) + e.extraCharge;
    }
  }
}

// ── 유물 헬퍼: 현재 런의 특정 유물 효과 값 반환 ──────
function getRelicEffect(type) {
  if (!state?.relics) return null;
  for (const r of state.relics) {
    if (r.effect.type === type) return r.effect;
  }
  return null;
}

function hasRelic(id) {
  return state?.relics?.some(r => r.id === id) ?? false;
}

// ── 넥서스 HP 회복 공통 헬퍼 ─────────────────────────
// isSpell=true: 스팀 업적·통계 적용, 골드 보상 없음
function _applyNexusHeal(amount, { isSpell = false, goldOnFull = 0 } = {}) {
  const maxHp = state.maxNexusHp ?? NEXUS_HP;
  if (state.nexusHp < maxHp) {
    state.nexusHp = Math.min(maxHp, state.nexusHp + amount);
    updateHUD();
    audio.play('nexus_heal');
    log(i18n.t(isSpell ? 'spell_nexus_heal' : 'log_nexus_healed', state.nexusHp), 'good');
    if (isSpell) {
      if (state?.stats) state.stats.nexusHealed = true;
      steam?.unlockAchievement('NEXUS_HEAL');
    }
  } else {
    if (goldOnFull > 0) addGold(goldOnFull, null);
    log(i18n.t('log_nexus_full'), '');
  }
}

// ── 이자 시스템 ───────────────────────────────────────
function applyInterest() {
  // Ascension II: 이자 시스템 비활성화
  if (state.ascMods?.noInterest) return;
  // 후반부 이자 임계값 동적 상승: Wave 11~20 = 25g, Wave 21+ = 40g
  const wave = state.wave ?? 0;
  const baseThreshold = wave <= 10 ? 10 : wave <= 20 ? 25 : 40;
  const threshold = hasRelic('lucky_coin') ? Math.max(5, baseThreshold - 5) : baseThreshold;
  if (state.gold >= threshold) {
    const bondEffect = getRelicEffect('interest_bonus');
    const interest = 1 + (bondEffect ? bondEffect.amount : 0);
    addGold(interest, null, true);
    if (bondEffect) log(i18n.t('log_savings_bond', bondEffect.amount), 'gold');
    else            log(i18n.t('log_interest', interest), 'gold');
  }
}

// ── 튜토리얼 초기화 ───────────────────────────────────
function startTutorial() {
  tutorial = new TutorialUI({
    onComplete: () => {
      tutorial = null;
      log(i18n.t('log_tutorial_done'), 'good');
      // 튜토리얼 완료 후 유물 선택
      setTimeout(() => _openRelicPicker(), 800);
    },
    onStepChange: (stepId) => {
      // 특정 스텝에서 게임 상태 힌트
      if (stepId === 'select_card') {
        log(i18n.t('tut_hint_select'), 'gold');
      }
      if (stepId === 'place_tower') {
        log(i18n.t('tut_hint_place'), 'gold');
      }
      if (stepId === 'start_wave') {
        log(i18n.t('tut_hint_wave'), 'gold');
      }
    },
  });
  tutorial.start();
}

// ── 게임 루프 ─────────────────────────────────────────
function gameLoop(now) {
  const delta = Math.min(200, now - lastTime) * gameSpeed;
  lastTime = now;

  if (!state) { rafId = requestAnimationFrame(gameLoop); return; }

  if (state.phase === 'wave') {
    enemySystem.update(delta);
    towerSystem.update(delta);

    if (enemySystem.isWaveClear()) {
      onWaveCleared();
    }
  }

  rafId = requestAnimationFrame(gameLoop);
}


// ── 웨이브 시작 ───────────────────────────────────────
function beginWave() {
  if (state.phase !== 'pre') return;

  // Iron Fortress: 웨이브별 넥서스 피격 카운터 리셋
  state._waveNexusDamageCount = 0;
  // PERFECT_WAVE 업적 추적: 웨이브 시작 시 피격 여부 초기화
  state._nexusHitThisWave = false;

  // 이자 시스템 (웨이브 시작 시 골드 > 임계값이면 +1g)
  if (state.wave > 0) applyInterest();

  state.phase = 'wave';
  state.wave++;
  setWaveButton(i18n.t('btn_wave_in_progress'), true);

  // 보스 웨이브 특별 처리
  const isBossWave = shared.bossWaves.has(state.wave);
  const actNum     = Math.ceil(state.wave / ACT_SIZE);

  if (isBossWave) {
    const bossName = state.wave === 5 ? 'Ironclad' : state.wave === 10 ? 'Void Titan' : 'Abyssal Dragon';
    log(i18n.t('log_boss_wave', bossName), 'bad');
    showClearBanner(state.wave, true);
    audio.play('boss_warning');
    music.crossfadeTo('boss');
  } else {
    log(i18n.t('log_wave_start', state.wave, actNum), 'bad');
    audio.play('wave_start');
  }

  // GRAVE_GOLD 패시브: 주문 카드는 웨이브 중 유지되므로 제외하고 계산
  if (state?.warden?.passive === PASSIVES.GRAVE_GOLD) {
    const discardCount = cardSystem.hand.filter(c => c.type !== 'spell').length;
    if (discardCount > 0) {
      addGold(discardCount, null, true);
      log(i18n.t('passive_grave_gold_trigger', discardCount), 'gold');
    }
  }

  // 주문 카드는 웨이브 중 사용을 위해 손패에 유지, 나머지만 버림
  const spellsKept = cardSystem.hand.filter(c => c.type === 'spell');
  cardSystem.discardPile.push(...cardSystem.hand.filter(c => c.type !== 'spell'));
  cardSystem.hand = spellsKept;
  renderer.clearSelection();
  state.selectedCard = null;
  renderHand();

  if (state?.stats) {
    state.stats.spellsThisWave        = 0;
    state.stats.enemiesKilledThisWave = 0;
  }
  // 난이도 스케일링 + 이벤트 효과 전달
  // Wave HP compound growth: +6% per wave to prevent Act 3 reverse-difficulty
  const waveHpMult = Math.pow(1.06, Math.max(0, state.wave - 1));
  const ascHpScale = state.ascMods?.hpScaleMult ?? 0;
  const hpScale    = ((state.difficulty?.hpScale ?? 1.15) + ascHpScale) * waveHpMult;
  const eliteBonus = state.difficulty?.eliteBonus ?? 0;
  const bossHpScale            = state.difficulty?.bossHpScale ?? 1;
  const enrageMult             = state.difficulty?.enrageMult ?? 1.8;
  const spawnIntervalMult      = state.difficulty?.spawnIntervalMult ?? 1;
  const veteranRegen           = state.difficulty?.veteranRegen ?? false;
  const noviceRegen            = state.difficulty?.noviceRegen ?? false;
  const spawnIntervalStartWave = state.difficulty?.spawnIntervalStartWave ?? 3;

  // slow_next_wave 이벤트: 적 기본 속도 감소 (예: 0.25 → 75% 속도)
  const spawnSpeedMult = state.nextWaveSlowMult
    ? (1 - state.nextWaveSlowMult)
    : 1;
  // extra_prep 이벤트: 첫 스폰 추가 지연 (ms 변환)
  const spawnDelay = (state.extraPrepSeconds ?? 0) * 1000;

  // 소모 후 초기화
  state.nextWaveSlowMult  = 0;
  state.extraPrepSeconds  = 0;

  // ── Cursed Wave (Balance Sync #10) ─────────────────────────────────────────
  state._cursedWave = null;
  if (CURSED_WAVES.has(state.wave)) {
    const types = ['speed', 'hand', 'revive'];
    const picked = types[Math.floor(Math.random() * types.length)];
    state._cursedWave = picked;
    if (picked === 'speed') {
      spawnSpeedMult *= 1.35;
      log(i18n.t('log_cursed_wave_speed'), 'bad');
    } else if (picked === 'hand') {
      cardSystem.bonusHandSize = (cardSystem.bonusHandSize || 0) - 2;
      log(i18n.t('log_cursed_wave_hand'), 'bad');
    } else {
      log(i18n.t('log_cursed_wave_revive'), 'bad');
    }
    audio.play('nexus_hit');
  }

  enemySystem.startWave(state.wave - 1, hpScale, eliteBonus, spawnDelay, spawnSpeedMult,
                        bossHpScale, enrageMult, spawnIntervalMult, veteranRegen,
                        noviceRegen, spawnIntervalStartWave,
                        state._cursedWave === 'revive');
  updateHUD();
  tutorial?.triggerEvent('wave_started');
}

// ── 웨이브 클리어 ─────────────────────────────────────
function onWaveCleared() {
  state.phase = 'post';
  resetGameSpeed();

  // 기본 웨이브 보상 + 유물 + 난이도 보정
  const badgeEffect    = getRelicEffect('wave_clear_gold');
  const diffWaveBonus  = state.difficulty?.waveGoldBonus ?? 0;
  const totalWaveGold  = WAVE_GOLD + (badgeEffect ? badgeEffect.amount : 0) + diffWaveBonus;
  addGold(Math.max(1, totalWaveGold), null);

  // DLC 2: invest_gold 이벤트 회수
  if (state._investGoldReturn > 0) {
    const returnAmt = state._investGoldReturn;
    state._investGoldReturn = 0;
    addGold(returnAmt, null);
    log(i18n.t('event_invest_gold_return', returnAmt) ?? `황금 투자 회수! +${returnAmt} 골드!`, 'gold');
  }

  // 승전 보너스 지급 (보스 처치 후 2웨이브)
  if (state._victoryStreakWaves > 0) {
    addGold(state._victoryStreakBonus, null);
    state._victoryStreakWaves--;
    log(i18n.t('log_victory_streak', state._victoryStreakBonus, state._victoryStreakWaves), 'gold');
  }

  // Cursed Wave 'hand' 패널티 해제
  if (state._cursedWave === 'hand') {
    cardSystem.bonusHandSize = (cardSystem.bonusHandSize || 0) + 2;
  }
  state._cursedWave = null;

  // DLC 2: temp_dmg_bonus 만료 처리
  if (state._tempDmgBonusWaves > 0) {
    state._tempDmgBonusWaves--;
    if (state._tempDmgBonusWaves === 0 && state._tempDmgBonusMult !== 1) {
      // 반전 배율 적용 (효과 제거)
      if (towerSystem) towerSystem.addRelicDmgBonus('__all__', 1 / state._tempDmgBonusMult);
      state._tempDmgBonusMult = 1;
    }
  }

  // Warden's Sigil: 웨이브 클리어 후 즉시 카드 추가 드로우
  if (hasRelic('wardens_sigil') && cardSystem) {
    const sigilEffect = getRelicEffect('wave_draw');
    const before = cardSystem.hand.length;
    cardSystem.drawExtra(sigilEffect.amount);
    const drawn = cardSystem.hand.length - before;
    if (drawn > 0) {
      renderHand();
      log(i18n.t('log_wave_draw', drawn), 'gold');
    }
  }

  $('boss-hpbar-wrap')?.classList.add('hidden');

  const isFinal   = state.wave >= shared.maxWaves;
  const isActEnd  = state.wave % ACT_SIZE === 0 && !isFinal;  // 액트 클리어 (보스)

  log(i18n.t('log_wave_clear', state.wave, totalWaveGold), 'good');
  audio.play(isFinal ? 'victory' : 'wave_clear');
  if (!isFinal) music.crossfadeTo('game');
  // QW#1: 웨이브 클리어 골드 플래시
  const mapArea = document.getElementById('map-area');
  if (mapArea) {
    mapArea.classList.remove('screen-flash-gold');
    void mapArea.offsetWidth;
    mapArea.classList.add('screen-flash-gold');
  }

  // ── Steam 업적: 웨이브 클리어 관련 ─────────────────────
  if (!state._nexusHitThisWave) {
    steam?.unlockAchievement('PERFECT_WAVE');           // 넥서스 무피격 클리어
    if (state.wave === 1) steam?.unlockAchievement('FIRST_WAVE'); // Wave 1 무피격
  }

  showClearBanner(state.wave, false, isActEnd);

  if (isFinal) {
    setTimeout(() => endGame(true), 2000);
    return;
  }

  // 웨이브 클리어 체크포인트 저장
  saveCheckpoint();

  // Act 전환: 1.5초 추가 대기 후 다음 Act 예고
  const delay = isActEnd ? 2500 : 1200;
  setTimeout(() => openNodeSelection(), delay);
}

// ── 노드 선택 화면 ────────────────────────────────────
function openNodeSelection() {
  state.phase = 'node';
  setWaveButton(i18n.t('btn_start_wave_n', state.wave + 1), true);

  // 챌린지: auto_shop → 노드 선택 없이 바로 상점
  if (state.challengeMods?.forceNode === 'shop') {
    openShop(); return;
  }

  nodeUI.open(state.wave, state.gold, {
    noRest:  state.challengeMods?.noRest  ?? false,
    noEvent: state.challengeMods?.noEvent ?? false,
  });
}

// ── 상점 열기 ─────────────────────────────────────────
function openShop() {
  state.phase = 'shop';
  $('screen-shop').classList.remove('hidden');
  // MetaSystem의 언락된 카드 목록 전달
  const unlockedIds = meta.unlockedCards;
  // Gold Lens 유물 + 난이도 할인 합산
  const discountEffect = getRelicEffect('shop_discount');
  const totalDiscount  = (discountEffect?.amount ?? 0) + (state.difficulty?.shopDiscount ?? 0);
  // Merchant's Ring: 상점 방문당 첫 리롤 무료
  const freeRerolls = hasRelic('merchants_ring') ? 1 : 0;
  // Ascension I: 상점 카드 2장으로 감소. Wave 16+: Elite 슬롯 +1
  const baseShopSize = state.ascMods?.shopSize ?? 3;
  const shopSize     = state.wave >= 16 ? baseShopSize + 1 : baseShopSize;
  shopUI.open(state.gold, state.wave, unlockedIds, totalDiscount, freeRerolls, shopSize, state.challengeMods);
}

// ── 이벤트 열기 ───────────────────────────────────────
function openEvent() {
  state.phase = 'event';
  eventUI.open();
}

// ── 휴식 열기 ─────────────────────────────────────────
function openRest() {
  state.phase = 'rest';
  // 드로우 파일 + 버림 파일 전체 = 현재 덱
  const allCards = [...cardSystem.drawPile, ...cardSystem.discardPile];
  restUI.open(allCards, state.gold);
}

// ── 이벤트 효과 처리 ─────────────────────────────────
function onEventEffect(effect) {
  switch (effect.type) {
    case 'gold':
      addGold(effect.amount, null);
      break;
    case 'cursed_gold':
      state._acceptedCurse = true;  // CURSED_WIN 업적 추적
      addGold(effect.amount, null);
      state.nexusHp = Math.max(0, state.nexusHp - effect.nexusDmg);
      updateHUD();
      audio.play('nexus_hit');
      if (state.nexusHp <= 0) { audio.play('defeat'); endGame(false); return; }
      log(i18n.t('log_nexus_cursed', state.nexusHp), 'bad');
      break;
    case 'add_cards': {
      const cards = pickRandomCards(effect.count, effect.rarity);
      for (const c of cards) cardSystem.discardPile.push(c);
      log(i18n.t('log_cards_added', effect.count, effect.rarity), 'good');
      break;
    }
    case 'slow_next_wave':
      state.nextWaveSlowMult = effect.amount;
      log(i18n.t('log_wave_slow'), 'good');
      break;
    case 'extra_prep':
      state.extraPrepSeconds = (state.extraPrepSeconds || 0) + effect.seconds;
      log(i18n.t('log_extra_prep', effect.seconds), 'good');
      break;
    case 'remove_random_add_gold': {
      const allCards = [...cardSystem.drawPile, ...cardSystem.discardPile];
      if (allCards.length > 0) {
        const victim = allCards[Math.floor(Math.random() * allCards.length)];
        cardSystem.drawPile = cardSystem.drawPile.filter(c => c.uid !== victim.uid);
        cardSystem.discardPile = cardSystem.discardPile.filter(c => c.uid !== victim.uid);
        log(i18n.t('log_card_removed_rand', victim.name), 'good');
      }
      addGold(effect.amount, null);
      break;
    }
    case 'heal_nexus':
      _applyNexusHeal(effect.amount, { goldOnFull: 4 });
      break;
    case 'spend_for_gold':
      // 즉시 지불 후 더 많은 골드 획득 (Debt Collector 등)
      if (state.gold >= effect.spend) {
        spendGold(effect.spend);
        addGold(effect.gain, null);
        log(i18n.t('spell_gold', effect.gain - effect.spend), 'gold');
      } else {
        // 골드 부족: 부분 지불 후 비례 지급
        const partial = state.gold;
        const partialGain = Math.round(effect.gain * (partial / effect.spend));
        if (partial > 0) spendGold(partial);
        if (partialGain > 0) addGold(partialGain, null);
        log(i18n.t('spell_gold', partialGain - partial), 'gold');
      }
      break;
    case 'heal_nexus_cost':
      if (state.gold < effect.cost) {
        log(i18n.t('log_not_enough_gold', effect.cost, state.gold), 'bad');
      } else {
        spendGold(effect.cost);
        _applyNexusHeal(effect.amount);
      }
      break;
    // DLC 2 Solar Dominion event effects
    case 'invest_gold': {
      const cost = effect.cost ?? 10;
      if (state.gold >= cost) {
        spendGold(cost);
        state._investGoldReturn = (state._investGoldReturn ?? 0) + (effect.returnAmount ?? 18);
        log(`투자 완료! 다음 웨이브 클리어 시 ${effect.returnAmount}골드 획득.`, 'good');
      } else {
        log(i18n.t('log_not_enough_gold', cost, state.gold), 'bad');
      }
      break;
    }
    case 'temp_dmg_bonus':
      state._tempDmgBonusWaves = (state._tempDmgBonusWaves ?? 0) + (effect.waves ?? 1);
      state._tempDmgBonusMult  = effect.mult ?? 1.20;
      // Apply to TowerSystem immediately
      if (towerSystem) towerSystem.addRelicDmgBonus('__all__', effect.mult ?? 1.20);
      log(`✨ 다음 ${effect.waves}웨이브 동안 모든 타워 피해 +${Math.round((effect.mult - 1) * 100)}%!`, 'good');
      break;
    case 'cursed_bargain': {
      // 저주 카드 덱 추가 + 레어 카드 1장 + 골드
      const curseId  = effect.curseCard ?? 'curse_dead_weight';
      const curseDef = CARD_DEFS.find(c => c.id === curseId);
      if (curseDef) cardSystem.discardPile.push({ ...curseDef, uid: Math.random() });
      const rareCards = pickRandomCards(1, 'rare');
      for (const c of rareCards) cardSystem.discardPile.push(c);
      if ((effect.gold ?? 0) > 0) addGold(effect.gold, null);
      log(i18n.t('log_cursed_bargain'), 'bad');
      break;
    }
    case 'add_curse_card': {
      const curseId2  = effect.curseCard ?? 'curse_dead_weight';
      const curseDef2 = CARD_DEFS.find(c => c.id === curseId2);
      if (curseDef2) cardSystem.discardPile.push({ ...curseDef2, uid: Math.random() });
      log(i18n.t('log_cursed_bargain'), 'bad');
      break;
    }
    case 'nothing':
    default:
      log(i18n.t('log_nothing'), '');
  }
}

// ── 휴식 콜백 ─────────────────────────────────────────
function onRestRemoveCard(uid) {
  cardSystem.drawPile    = cardSystem.drawPile.filter(c => c.uid !== uid);
  cardSystem.discardPile = cardSystem.discardPile.filter(c => c.uid !== uid);
  updateHUD();
}

function onRestGoldBonus(amount) {
  addGold(amount, null);
}

// ── 저주 카드 처리 (드로우 후) ────────────────────────
function _processCurseCards() {
  // curse_regret: 드로우 시 손패에서 무작위 카드 1장 버림
  const regretCards = cardSystem.hand.filter(c => c.id === 'curse_regret');
  for (const _ of regretCards) {
    const nonCurse = cardSystem.hand.filter(c => c.type !== 'curse');
    if (nonCurse.length > 0) {
      const victim = nonCurse[Math.floor(Math.random() * nonCurse.length)];
      cardSystem.hand = cardSystem.hand.filter(c => c.uid !== victim.uid);
      cardSystem.discardPile.push(victim);
      log(i18n.t('log_curse_regret', victim.name || victim.nameKo || '?'), 'bad');
    }
  }
}

// ── 노드 공통 종료 → 다음 웨이브 준비 ───────────────
function onNodeClose() {
  state.phase = 'pre';
  cardSystem.drawHand();
  _processCurseCards();
  renderHand();
  setWaveButton(i18n.t('btn_start_wave_n', state.wave + 1), false);
  updateHUD();
  log(i18n.t('log_prepare_wave', state.wave + 1));
}

// ── 상점 콜백: 카드 구매 ─────────────────────────────
function onShopBuy(card) {
  if (card._rerollCost) {
    spendGold(card._rerollCost);
    shopUI.updateGold(state.gold);
    audio.play('shop_reroll');
    return;
  }
  spendGold(card.cost);
  const newCard = { ...card, uid: Math.random() };
  delete newCard._bought;
  cardSystem.discardPile.push(newCard);
  shopUI.updateGold(state.gold);
  updateHUD();
  audio.play('shop_buy');
}

// ── 상점 콜백: 나가기 ─────────────────────────────────
function onShopLeave() {
  $('screen-shop').classList.add('hidden');
  shopUI.close();
  log(i18n.t('log_shop_closed'));
  onNodeClose();
}

// ── 적 처리 콜백 ──────────────────────────────────────
function onEnemyReachEnd() {
  state._nexusHitThisWave = true;  // PERFECT_WAVE 업적: 이번 웨이브 넥서스 피격 기록

  // DLC 2: Divine Shield — 넥서스 무적 상태
  if (state._divineShieldActive && Date.now() < state._divineShieldExpiry) {
    log(i18n.t('log_divine_shield_block') ?? '✨ Divine Shield blocked the hit!', 'good');
    return;
  }
  if (state._divineShieldActive && Date.now() >= state._divineShieldExpiry) {
    state._divineShieldActive = false;
  }

  // 넥서스 피격 화면 테두리 빨강 비네트
  const _appEl = document.getElementById('app');
  if (_appEl) {
    _appEl.classList.remove('nexus-hit');
    void _appEl.offsetWidth;  // reflow — 애니메이션 재시작
    _appEl.classList.add('nexus-hit');
    setTimeout(() => _appEl.classList.remove('nexus-hit'), 700);
  }

  // Soul Anchor: 첫 번째 넥서스 피격 1회 무효화
  if (hasRelic('soul_anchor') && !state._soulAnchorUsed) {
    state._soulAnchorUsed = true;
    log(i18n.t('log_soul_anchor'), 'good');
    audio.play('nexus_heal');
    shakeNexus();
    return;
  }

  // 챌린지: perfect_nexus — 피격 즉시 런 종료
  if (state.challengeMods?.nexusPerfect) {
    log(i18n.t('challenge_perfect_fail'), 'bad');
    audio.play('defeat');
    endGame(false);
    return;
  }

  // Iron Fortress: 웨이브당 넥서스 최대 1회 피격
  if (hasRelic('iron_fortress')) {
    if ((state._waveNexusDamageCount ?? 0) >= 1) {
      log(i18n.t('log_iron_fortress'), 'good');
      shakeNexus();
      return;
    }
    state._waveNexusDamageCount = (state._waveNexusDamageCount ?? 0) + 1;
  }

  state.nexusHp--;
  updateHUD();
  shakeNexus();
  audio.play('nexus_hit');
  log(i18n.t('log_nexus_hit', state.nexusHp), 'bad');

  // Thorn Wall: 넥서스 피격 시 가장 가까운 적에게 반사 피해
  if (hasRelic('thorn_wall') && enemySystem) {
    const thornEffect = getRelicEffect('thorn_wall');
    const hit = enemySystem.dealDamageToLead(thornEffect.damage);
    if (hit) log(i18n.t('log_thorn_wall', thornEffect.damage), 'good');
  }

  if (state.nexusHp <= 0) { audio.play('defeat'); endGame(false); }
}

function onEnemyKilled(reward, isSplitChild = false) {
  // QW#3: 적 등급별 히트스톱 (보스 75ms, 엘리트/탱크 40ms — 일반 적은 생략)
  if (reward >= 20) hitStop(75);
  else if (reward >= 3) hitStop(40);

  // 분열 자식 적은 골드 보너스 제외 (Bounty Mark, Bloodlust 비적용)
  let bonus = 0;
  if (!isSplitChild) {
    // Bloodlust 패시브: Storm Warden — 적 처치 골드 +1
    if (state?.warden?.passive === PASSIVES.BLOODLUST) {
      bonus = reward >= 20 ? 5 : 1;  // 보스는 +5
    }
    // Bounty Mark 유물: 처치 시 +1g
    const bountyEffect = getRelicEffect('kill_gold_bonus');
    if (bountyEffect) bonus += bountyEffect.amount;
  }

  addGold(reward + bonus, null, true);

  // 승전 보너스: 보스 처치 시 다음 2웨이브 동안 웨이브 보상 추가
  if (!isSplitChild && reward >= 20 && state) {
    const streakBonus = reward >= 45 ? 5 : 4;  // DLC 중간보스 이상 +5g, 일반 보스 +4g
    state._victoryStreakWaves = 2;
    state._victoryStreakBonus = streakBonus;
    log(i18n.t('log_victory_streak_start', 2), 'good');
  }

  // Venom Fang: 처치 시 무작위 살아있는 적에게 독 피해
  if (hasRelic('venom_fang') && enemySystem?.enemies?.length > 0) {
    const venomEffect = getRelicEffect('venom_fang');
    enemySystem.dealDamageToRandom(1, venomEffect.damage);
    log(i18n.t('log_venom_fang', venomEffect.damage), 'good');
  }

  // ── Shadow Charge 패시브 (Shadow Realm Warden DLC) ──────
  if (state?.warden?.passive === 'shadow_charge') {
    state.shadowCharges = (state.shadowCharges ?? 0) + 1;
    updateShadowChargeHUD();
    if (state.shadowCharges >= 10) {
      state.shadowCharges = 0;
      updateShadowChargeHUD();
      _triggerShadowAutoSpell();
    }

    // undying_will 유물: 5처치마다 보너스 충전 +1
    const undyingEffect = getRelicEffect('shadow_charge_on_kills');
    if (undyingEffect) {
      state._undyingWillKills = (state._undyingWillKills ?? 0) + 1;
      if (state._undyingWillKills >= undyingEffect.killsPerCharge) {
        state._undyingWillKills = 0;
        state.shadowCharges = (state.shadowCharges ?? 0) + 1;
        updateShadowChargeHUD();
        if (state.shadowCharges >= 10) {
          state.shadowCharges = 0;
          updateShadowChargeHUD();
          _triggerShadowAutoSpell();
        }
      }
    }
  }

  if (!state?.stats) return;
  state.stats.enemiesKilled++;
  state.stats.enemiesKilledThisWave = (state.stats.enemiesKilledThisWave ?? 0) + 1;

  // 보상 기반으로 적 종류 추론
  if (reward >= 20) {
    // 보스 (reward=20)
    state.stats.bossKilled = true;
    steam?.unlockAchievement('BOSS_KILLER');
  } else if (reward >= 4) {
    // 엘리트 (reward=4)
    state.stats.eliteKills++;
    if (state.stats.eliteKills >= 10) steam?.unlockAchievement('ELITE_HUNTER');
  } else if (reward >= 3) {
    // 탱크 (reward=3)
    steam?.unlockAchievement('TANK_KILLER');
  }

  steam?.checkKillMilestone(meta.totalKills + state.stats.enemiesKilled);
  steam?.checkDeckSize(cardSystem?.deckCount ?? 0);
}

// ── 게임 종료 → 요약 화면 ────────────────────────────
function endGame(victory) {
  state.phase = 'over';
  if (rafId) cancelAnimationFrame(rafId);
  // 런 종료 시 자동저장 클리어 (승리/패배 모두)
  localStorage.removeItem('rw_autosave');

  // 런 통계 수집
  const runStats = {
    victory,
    wavesCleared:   state.wave,
    enemiesKilled:  state.stats.enemiesKilled,
    goldEarned:     state.stats.goldEarned,
    cardsPlayed:    cardSystem?.totalPlayed ?? 0,
    nexusHpLeft:    Math.max(0, state.nexusHp),
    mapName:        state.mapName ?? state.mapId ?? '',
    mapIcon:        state.mapIcon ?? '🗺️',
    difficultyId:   state.difficulty?.id ?? 'standard',
    difficultyIcon: state.difficulty?.icon ?? '⚔️',
    difficultyName: state.difficulty ? i18n.t('diff_' + state.difficulty.id) : '',
    ascension:      state.ascension ?? 0,
  };

  // Ascension 클리어 처리
  if (victory && state.ascension > 0) {
    const isNewRecord = meta.clearAscension(state.ascension);
    if (isNewRecord) {
      if (state.ascension < 3) {
        log(i18n.t('log_asc_cleared', state.ascension), 'gold');
      } else {
        log(i18n.t('log_asc_all_clear'), 'gold');
      }
    }
  }

  // 메타 XP 적용 (챌린지 보너스 배율 포함)
  const rankBefore    = meta.rank;
  const xpBefore      = meta.totalXP;
  const xpMultiplier  = 1 + getChallengeXPBonus(state.challenges ?? []);
  const { xpGained, newUnlocks } = meta.applyRunResult(runStats, xpMultiplier);

  // Steam 업적 체크 (풀 stat 전달)
  const runTimeMs = Date.now() - (state._runStartTime ?? Date.now());
  steam.checkRunStats({
    ...runStats,
    runTimeMs,
    augmentsApplied:   state.stats.augmentsApplied,
    eliteKills:        state.stats.eliteKills,
    bossKilled:        state.stats.bossKilled,
    nexusHealed:       state.stats.nexusHealed,
    spellsCastThisWave: state.stats.maxSpellsInWave,
  });
  steam.checkKillMilestone(meta.totalKills);
  steam.checkRankMilestone(meta.rank);

  // Steam 통계 동기화
  steam.setStat(STEAM_STATS?.TOTAL_KILLS  ?? 'stat_total_kills',  meta.totalKills);
  steam.setStat(STEAM_STATS?.TOTAL_WINS   ?? 'stat_total_wins',   meta.runsWon);
  steam.setStat(STEAM_STATS?.TOTAL_RUNS   ?? 'stat_total_runs',   meta.runsPlayed);
  if (runStats.wavesCleared >= 1) steam.unlockAchievement('FIRST_RUN');
  // 승리 시 추가 업적 체크
  if (victory) {
    if (state._acceptedCurse)            steam?.unlockAchievement('CURSED_WIN');
    if (runStats.nexusHpLeft >= 3)       steam?.unlockAchievement('PERFECT_RUN');
    if (runTimeMs < 20 * 60 * 1000)      steam?.unlockAchievement('SPEED_RUN');
    steam?.unlockAchievement('FIRST_WIN');
  }

  const metaResult = {
    rankBefore,
    rankAfter:  meta.rank,
    xpBefore,
    xpAfter:    meta.totalXP,
    xpGained,
    newUnlocks,
    totalRuns:  meta.runsPlayed,
    totalWins:  meta.runsWon,
    totalKills: meta.totalKills,
  };

  // 런 히스토리 기록
  meta.recordRun({
    wardenId:    state.warden.id,
    diffId:      state.difficulty.id,
    ascension:   state.ascension,
    wavesCleared: state.wave,
    victory,
    ts:          Date.now(),
    wardenIcon:  state.warden.icon,
    wardenName:  state.warden.name,
    diffIcon:    state.difficulty.icon,
    diffName:    i18n.t('diff_' + state.difficulty.id),
  });

  // 기존 게임오버 화면 대신 요약 화면 표시
  summaryUI.show(runStats, { ...metaResult, runHistory: meta.runHistory }, {
    onContinue: () => startRun(),
    onMenu:     () => showScreen('menu'),
    onRetry:    () => quickRestart(),
  });
}

function quickRestart() {
  const last = meta.runHistory[0];
  if (!last) { startRun(); return; }
  const warden = getWardenById(last.wardenId);
  const diff   = getDifficultyById(last.diffId);
  if (warden) shared.selectedWarden     = warden;
  if (diff)   shared.selectedDifficulty = diff;
  shared.selectedAscension  = last.ascension ?? 0;
  shared.selectedChallenges = [];
  startRun();
}

// ── 카드 클릭 처리 ────────────────────────────────────
function onCardClick(card) {
  if (state.phase === 'over') return;

  // Arcane Flow 패시브: 주문 코스트 -1
  const arcaneDiscount = (card.type === 'spell' && state?.warden?.passive === PASSIVES.ARCANE_FLOW) ? 1 : 0;
  // 웨이브 중 추가 비용 (Ascension III: +2 instead of +1)
  // 주문 카드는 웨이브 중 사용을 위해 설계되어 있으므로 추가 비용 면제
  const waveSurcharge = (state.phase === 'wave' && card.type !== 'spell')
    ? 1 + (state.ascMods?.extraSurcharge ?? 0) : 0;
  const cost = Math.max(0, card.cost + waveSurcharge - arcaneDiscount);

  // 저주 카드: 플레이 불가
  if (card.type === 'curse') {
    log(i18n.t('log_curse_unplayable'), 'bad');
    return;
  }

  // 골드 부족
  if (cost > state.gold) {
    log(waveSurcharge > 0
      ? i18n.t('log_surcharge', cost, waveSurcharge)
      : i18n.t('log_not_enough_gold', cost, state.gold), 'bad');
    return;
  }

  // 챌린지: 카드 타입 제한
  const cm = state.challengeMods;
  if (cm?.bannedCardTypes?.includes(card.type)) {
    log(i18n.t('challenge_card_banned', i18n.t('card_type_' + card.type)), 'bad');
    return;
  }
  // 챌린지: 타워 제한
  if (card.type === 'summon' && cm) {
    const towerId = TOWER_DEFS[card.tower]?.id ?? card.tower;
    if (cm.allowedTowers && !cm.allowedTowers.includes(towerId)) {
      log(i18n.t('challenge_tower_banned'), 'bad');
      return;
    }
    if (cm.bannedTowers?.includes(towerId)) {
      log(i18n.t('challenge_tower_banned'), 'bad');
      return;
    }
  }

  // 주문 카드: 즉시 실행
  if (card.type === 'spell') {
    spendGold(cost);
    cardSystem.playCard(card.uid);
    audio.play('spell_cast');
    resolveSpell(card.effect);
    _triggerSolarCharge({ ...card, cost });  // DLC 2: Solar Charge 충전 (원본 cost 전달)
    if (state?.stats) {
      state.stats.spellsThisWave++;
      state.stats.maxSpellsInWave = Math.max(
        state.stats.maxSpellsInWave, state.stats.spellsThisWave
      );
      if (state.stats.spellsThisWave >= 5) steam?.unlockAchievement('SPELL_POWER');
    }
    renderHand();
    updateHUD();
    return;
  }

  // 소환/강화: 셀 선택 대기
  if (state.selectedCard?.uid === card.uid) {
    state.selectedCard = null;
    renderer.clearSelection();
    renderHand();
    return;
  }

  audio.play('card_select');
  state.selectedCard = { ...card, activeCost: cost };
  renderHand();
  const _cName = i18n.lang === 'ko' ? (card.nameKo || card.name) : card.name;
  log(card.type === 'summon' ? i18n.t('log_select_summon', _cName) : i18n.t('log_select_augment', _cName));
  tutorial?.triggerEvent('card_selected');
  if (card.type === 'summon') tutorial?.triggerEvent('card_selected_summon');
}

// ── 셀 hover → 사거리 미리보기 ────────────────────────
function onCellHover(col, row, entering) {
  if (!state.selectedCard || state.phase === 'over') {
    // 선택 카드 없을 때: 기존 타워 사거리 표시
    if (entering) {
      const tower = towerSystem?.getTower(col, row);
      if (tower) renderer.showRange(col, row, tower.range); // 픽셀 단위
    } else {
      renderer.hideRange();
    }
    return;
  }

  if (!entering) { renderer.hideRange(); return; }

  if (state.selectedCard.type === 'summon') {
    const tDef = TOWER_DEFS[state.selectedCard.tower];
    if (tDef && isPlaceableCell(col, row) && !towerSystem.getTower(col, row)) {
      renderer.showRange(col, row, rangeToPixel(tDef.range));
    }
  } else if (state.selectedCard.type === 'augment') {
    const tower = towerSystem?.getTower(col, row);
    if (tower) renderer.showRange(col, row, tower.range); // tower.range는 이미 픽셀
  }
}

// ── 셀 클릭 처리 ──────────────────────────────────────
function onCellClick(col, row, cellEl) {
  if (!state.selectedCard) return;
  if (state.phase === 'over') return;

  const card = state.selectedCard;

  if (card.type === 'summon') {
    if (!isPlaceableCell(col, row)) { log(i18n.t('log_cannot_place'), 'bad'); return; }
    if (towerSystem.getTower(col, row)) { log(i18n.t('log_tower_exists'), 'bad'); return; }

    const tDef = TOWER_DEFS[card.tower];
    if (!tDef) return;

    spendGold(card.activeCost);
    cardSystem.playCard(card.uid);
    towerSystem.place(col, row, tDef);
    renderer.placeTower(col, row, tDef);
    audio.play('tower_place');
    state.stats.towerTypesUsed.add(tDef.id);
    steam?.checkAllTowers(state.stats.towerTypesUsed);
    log(i18n.t('log_card_placed', tDef.name, col, row), 'good');
    tutorial?.triggerEvent('tower_placed');

  } else if (card.type === 'augment') {
    const existing = towerSystem.getTower(col, row);
    if (!existing) { log(i18n.t('log_no_tower'), 'bad'); return; }
    if (existing.augments.length >= 2) { log(i18n.t('log_max_augments'), 'bad'); return; }

    spendGold(card.activeCost);
    cardSystem.playCard(card.uid);
    const ok = towerSystem.augment(col, row, card.effect);
    if (ok) {
      const augLen = towerSystem.getTower(col, row)?.augments?.length ?? 1;
      renderer.markAugmented(col, row, existing.def, augLen);
      audio.play('augment_apply');
      state.stats.augmentsApplied++;
    }
  }

  state.selectedCard = null;
  renderer.clearSelection();
  renderHand();
  updateHUD();
}

// ── 주문 해결 ─────────────────────────────────────────
// 로직은 SpellResolver.js 핸들러 맵으로 이전됨. 이 래퍼가 ctx를 주입합니다.
function resolveSpell(effect) {
  _resolveSpellImpl(effect, {
    addGold, log, i18n, audio,
    enemySystem, towerSystem, cardSystem,
    state, hasRelic, renderHand,
    applyNexusHeal: _applyNexusHeal,
  });
}

// ── 골드 ──────────────────────────────────────────────
// silent=true: 적 처치 등 빈번한 소액 골드 — 사운드 억제
function addGold(amount, xy, silent = false) {
  state.gold += amount;
  if (state?.stats) state.stats.goldEarned += amount;
  updateHUD();
  if (xy) spawnFloatText(`+${amount}`, xy.x, xy.y, 'gold');
  if (amount > 0 && !silent) {
    audio.play('gold_gain');
    // QW#1: 골드 HUD 펀치 애니메이션
    const goldEl = document.getElementById('hud-gold');
    if (goldEl) {
      goldEl.classList.remove('gold-punch');
      void goldEl.offsetWidth;
      goldEl.classList.add('gold-punch');
    }
  }
}

function spendGold(amount) {
  state.gold = Math.max(0, state.gold - amount);
  updateHUD();
}

// ── Solar Charge 충전 & 자동 시전 (DLC 2) ──────────────
function _triggerSolarCharge(card) {
  if (!state || !card) return;
  if (state.warden?.passive !== PASSIVES.SOLAR_CHARGE_SOLAR) return;
  if (card.type !== 'spell') return;
  if (card._isAutocast) return;            // 자동 시전 연쇄 차단
  const originalCost = card.cost ?? 0;
  if (originalCost < 2) return;           // cost < 2 주문은 충전 안 됨

  // Radiant Will 유물: cost 4+ 주문은 +1 추가 충전
  let extra = 0;
  if (originalCost >= 4 && state._solarChargeExtraOnHighCost > 0) {
    extra = state._solarChargeExtraOnHighCost;
  }
  state._solarChargeCount += 1 + extra;

  const max = state._solarChargeMax ?? 8;
  log(i18n.t('dlc_sd_log_solar_charge', state._solarChargeCount, max), 'info');

  if (state._solarChargeCount >= max) {
    state._solarChargeCount = 0;
    _triggerSolarAutoSpell();
  }
  _updateSolarChargeHUD();
}

function _updateSolarChargeHUD() {
  const n   = state?._solarChargeCount ?? 0;
  const max = state?._solarChargeMax   ?? 8;
  // reuse shadow HUD or call dedicated Solar HUD if available
  const hudFn = typeof updateSolarChargeHUD === 'function'
    ? updateSolarChargeHUD
    : (typeof updateShadowChargeHUD === 'function' ? updateShadowChargeHUD : null);
  hudFn?.(n, max);
}

function _triggerSolarAutoSpell() {
  const SOLAR_AUTO_SPELLS = [
    'spell_solar_beam', 'spell_radiant_burst',
    'spell_solar_flare', 'spell_solar_nova',
  ];
  const available = SOLAR_AUTO_SPELLS.filter(id => CARD_DEFS.find(c => c.id === id));
  if (!available.length) return;

  const spellId = 'spell_solar_beam';  // Solar Beam은 항상 자동 시전 고정
  const card    = CARD_DEFS.find(c => c.id === spellId);
  if (!card) return;

  const spellName = i18n.lang === 'ko' ? (card.nameKo || card.name) : card.name;
  log(i18n.t('dlc_sd_log_auto_cast', spellName), 'gold');
  audio?.play('spell_cast');
  resolveSpell({ ...card.effect, _isAutocast: true });
}

// ── Shadow Charge 자동 주문 발동 (DLC 1) ────────────────
function _triggerShadowAutoSpell() {
  const SHADOW_AUTO_SPELLS = [
    'spell_darkness', 'spell_shadow_nova',
    'spell_void_pulse', 'spell_soul_drain',
    'spell_entropy',
  ];
  const available = SHADOW_AUTO_SPELLS.filter(id =>
    CARD_DEFS.find(c => c.id === id)
  );
  if (!available.length) return;

  const spellId = available[Math.floor(Math.random() * available.length)];
  const card    = CARD_DEFS.find(c => c.id === spellId);
  if (!card) return;

  log(`👁️ ${i18n.t('dlc_sr_log_auto_cast', i18n.lang === 'ko' ? (card.nameKo || card.name) : card.name)}`, 'gold');
  audio?.play('spell_cast');
  resolveSpell({ ...card.effect, _isAutocast: true });   // 무료 자동 발동 — 골드 소모 없음, 연쇄 차단
}

// ── 이벤트 리스너 ─────────────────────────────────────
// 첫 사용자 인터랙션에서 메뉴 BGM 시작 (Web Audio API 정책)
let _bgmStarted = false;
function _startMenuBGM() {
  if (_bgmStarted) return;
  _bgmStarted = true;
  music.play('menu');
}
document.addEventListener('click', _startMenuBGM, { once: true });
document.addEventListener('keydown', _startMenuBGM, { once: true });

$('btn-start').addEventListener('click', openWardenSelect);
$('btn-continue')?.addEventListener('click', () => {
  let saveData = null;
  try { saveData = JSON.parse(localStorage.getItem('rw_autosave') || 'null'); } catch {}
  if (!saveData?.v) return;
  // 저장된 Warden·난이도·Ascension 복원 후 런 시작
  shared.selectedWarden     = getWardenById(saveData.wardenId);
  shared.selectedDifficulty = getDifficultyById(saveData.diffId) ?? getDifficultyById('standard');
  shared.selectedAscension  = saveData.asc ?? 0;
  shared._savedRunData      = saveData;
  audio.play('ui_click');
  startRun();
});
$('btn-how').addEventListener('click', () => {
  // 메뉴를 숨기지 않고 overlay만 표시
  $('screen-howto').classList.remove('hidden');
});
$('btn-codex').addEventListener('click', openCodex);
$('btn-replay-tut').addEventListener('click', () => {
  TutorialUI.reset();
  shared.selectedWarden = WARDEN_DEFS[0];  // 튜토리얼은 Iron Warden으로
  startRun();
});
$('btn-howto-close').addEventListener('click', () => {
  // overlay만 닫고 메뉴는 그대로 유지
  const el = $('screen-howto');
  el.classList.add('hidden');
  el.style.zIndex = '';   // 일시정지에서 열렸을 때 설정한 z-index 초기화
});
$('btn-warden-cancel').addEventListener('click', () => {
  $('screen-warden-select').classList.add('hidden');
});
$('btn-wave').addEventListener('click', beginWave);
$('btn-retry').addEventListener('click', openWardenSelect);
$('btn-menu').addEventListener('click', () => showScreen('menu'));

// ── 일시정지 버튼 리스너 ──────────────────────────────
$('btn-pause').addEventListener('click', () => { audio.play('ui_pause'); pauseGame(); });
$('btn-resume').addEventListener('click', () => { audio.play('ui_click'); resumeGame(); });
$('btn-pause-howto').addEventListener('click', () => {
  // 일시정지 상태에서 How to Play 열기 (pause 오버레이 뒤에 겹쳐서 표시)
  $('screen-howto').classList.remove('hidden');
  $('screen-howto').style.zIndex = '600';  // pause(500)보다 위
});
// BGM / SFX 분리 볼륨 슬라이더
(() => {
  const bgmSlider = $('bgm-slider');
  const sfxSlider = $('sfx-slider');
  if (bgmSlider) {
    bgmSlider.value = Math.round(audio.getBGMVolume() * 100);
    bgmSlider.addEventListener('input', e => {
      const v = e.target.value / 100;
      audio.setBGMVolume(v);
      music.setVolume(v);
    });
  }
  if (sfxSlider) {
    sfxSlider.value = Math.round(audio.getSFXVolume() * 100);
    sfxSlider.addEventListener('input', e => {
      audio.setSFXVolume(e.target.value / 100);
    });
  }
})();

// HUD 덱 카운터 클릭 → 덱 뷰 오버레이
$('hud-deck')?.addEventListener('click', () => {
  if (state?.phase !== 'wave') openDeckView();
});
$('btn-mute').addEventListener('click', () => {
  const muted = audio.toggleMute();
  $('btn-mute').textContent = muted ? '🔇' : '🔊';
  music.setVolume(muted ? 0 : 0.28);
});

$('btn-quit-menu').addEventListener('click', () => {
  // 게임 루프 종료 후 메인 메뉴로
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  if (state) state.phase = 'over';
  showScreen('menu');
});

// 속도 버튼
$('btn-speed').addEventListener('click', () => { if (state?.phase === 'wave') toggleGameSpeed(); });

// ── 키보드 단축키 ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key   = e.key;
  const phase = state?.phase;

  // ── ESC ───────────────────────────────────────────
  if (key === 'Escape') {
    if (!$('screen-deck-view')?.classList.contains('hidden')) {
      $('screen-deck-view').classList.add('hidden'); return;
    }
    if (!$('screen-howto').classList.contains('hidden')) {
      $('btn-howto-close')?.click(); return;
    }
    if (!$('screen-warden-select').classList.contains('hidden')) {
      $('btn-warden-cancel')?.click(); return;
    }
    if (phase === 'paused')  { resumeGame(); return; }
    if (phase === 'shop')    { $('screen-shop').querySelector('#shop-leave')?.click(); return; }
    if (phase === 'rest')    { $('screen-rest').querySelector('#rest-leave')?.click(); return; }
    if (shared.screens.game.classList.contains('active') && phase !== 'over') { pauseGame(); }
    return;
  }

  // ── 메인 메뉴 ─────────────────────────────────────
  if (shared.screens.menu.classList.contains('active')) {
    if (key === 'Enter') { $('btn-start')?.click(); return; }
    if (key === 'c' || key === 'C') {
      const cont = $('btn-continue');
      if (cont && !cont.classList.contains('hidden')) cont.click();
      return;
    }
    return;
  }

  // ── 일시정지 ──────────────────────────────────────
  if (phase === 'paused') {
    if (key === 'm' || key === 'M') { $('btn-mute')?.click(); return; }
    if (key === 'q' || key === 'Q') { $('btn-quit-menu')?.click(); return; }
    return;
  }

  // ── 게임 오버 / 결산 ──────────────────────────────
  if (phase === 'over') {
    if (key === 'r' || key === 'R') { $('btn-retry')?.click(); return; }
    if (key === 'm' || key === 'M') { $('btn-menu')?.click(); return; }
    return;
  }

  if (!shared.screens.game.classList.contains('active')) return;

  // ── Tab: 게임 속도 토글 (웨이브 중) ──────────────
  if (key === 'Tab') {
    e.preventDefault();
    if (phase === 'wave') toggleGameSpeed();
    return;
  }

  // ── D: 덱 뷰 (웨이브 중 제외) ────────────────────
  if (key === 'd' || key === 'D') {
    if (phase !== 'wave') openDeckView();
    return;
  }

  // ── 노드 선택 ─────────────────────────────────────
  if (phase === 'node') {
    if (key === '1') { $('node-shop')?.click(); return; }
    if (key === '2') { $('node-event')?.click(); return; }
    if (key === '3') { $('node-rest')?.click(); return; }
    return;
  }

  // ── 상점 ─────────────────────────────────────────
  if (phase === 'shop') {
    if (key === 'r' || key === 'R') { shopUI?._reroll(); return; }
    if (key === 'l' || key === 'L') { $('screen-shop').querySelector('#shop-leave')?.click(); return; }
    const shopIdx = parseInt(key) - 1;
    if (shopIdx >= 0 && shopIdx <= 2) {
      const slots = document.querySelectorAll('#screen-shop .shop-card-slot');
      slots[shopIdx]?.querySelector('.btn-buy.can-buy')?.click();
      return;
    }
    return;
  }

  // ── 이벤트 ───────────────────────────────────────
  if (phase === 'event') {
    const choices = document.querySelectorAll('#screen-event .event-choice');
    const idx = parseInt(key) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < choices.length) choices[idx]?.click();
    return;
  }

  // ── 휴식 ─────────────────────────────────────────
  if (phase === 'rest') {
    if (key === '1') { $('screen-rest').querySelector('#rest-remove')?.click(); return; }
    if (key === '2') { $('screen-rest').querySelector('#rest-gold')?.click(); return; }
    return;
  }

  // ── 준비 단계: Space → 웨이브 시작 ────────────────
  if (key === ' ' && phase === 'pre') {
    e.preventDefault();
    $('btn-wave')?.click();
    return;
  }

  // ── 준비/웨이브: 카드 조작 ────────────────────────
  if (phase === 'pre' || phase === 'wave') {
    if (key === 'f' || key === 'F') {
      if (state.selectedCard) {
        state.selectedCard = null;
        renderer?.clearSelection();
        renderHand();
      }
      return;
    }
    const num = parseInt(key);
    if (num >= 1 && num <= 5) {
      const card = cardSystem?.hand?.[num - 1];
      if (card) onCardClick(card);
      return;
    }
  }
});

// ── 다국어 초기화 ────────────────────────────────────
i18n.init();
// 언어 변경 시 동적 UI 갱신
i18n.onChange(() => {
  updateMenuRank();
  // 워든 선택 화면이 열려 있으면 리렌더링
  if (!$('screen-warden-select').classList.contains('hidden')) {
    openWardenSelect();
  }
  // 상점이 열려 있으면 리빌드
  if (shopUI && !$('screen-shop').classList.contains('hidden')) {
    shopUI._build();
    shopUI._renderCards();
    shopUI._refreshRerollBtn();
  }
});

// ── 초기 화면 ─────────────────────────────────────────
showScreen('menu');

// ── 메뉴 앰비언트 파티클 (룬 부유 효과) ──────────────
(function initMenuParticles() {
  const bg = document.querySelector('.menu-bg');
  if (!bg) return;

  const COLORS = ['#D4AF37','#9B59B6','#2980B9','#00CED1','#D4AF37'];
  const SHAPES = ['●','◆','✦','◈','▲'];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    const size   = 3 + Math.random() * 5;            // 3~8px
    const left   = Math.random() * 100;               // 0~100%
    const dur    = 14 + Math.random() * 14;           // 14~28초 사이클
    const delay  = -(Math.random() * dur);            // 시작 위치 분산
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    p.textContent = shape;
    p.style.cssText = [
      'position:absolute',
      `left:${left.toFixed(1)}%`,
      'bottom:-10px',
      `font-size:${size.toFixed(1)}px`,
      `color:${color}`,
      'opacity:0',
      'pointer-events:none',
      'will-change:transform,opacity',
      `animation:menuParticle ${dur.toFixed(1)}s ${delay.toFixed(1)}s linear infinite`,
    ].join(';');
    bg.appendChild(p);
  }

  // 파티클 애니메이션 정의 (CSS에 주입)
  if (!document.getElementById('menu-particle-style')) {
    const s = document.createElement('style');
    s.id = 'menu-particle-style';
    s.textContent = `
      @keyframes menuParticle {
        0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
        8%   { opacity: 0.45; }
        90%  { opacity: 0.3; }
        100% { transform: translateY(-105vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

// ── 개발용 전역 헬퍼 (테스트 편의) ───────────────────
window.__dev = {
  openNode:    () => { if (state) { state.wave = 1; openNodeSelection(); } },
  openShop:    () => { if (state) { state.wave = 1; openShop(); } },
  openEvent:   () => { if (state) { state.wave = 1; openEvent(); } },
  openRest:    () => { if (state) { state.wave = 1; openRest(); } },
  clearWave:   () => { if (state) onWaveCleared(); },
  endGame:     (v=false) => { if (state) endGame(v); },
  metaReset:   () => { meta.reset(); log('Meta reset!', 'bad'); },
  metaInfo:    () => ({ rank: meta.rank, xp: meta.totalXP, bonuses: meta.bonuses }),
  tutReset:    () => { TutorialUI.reset(); log('Tutorial reset! Restart run to replay.', 'gold'); },
  tutStart:    () => { if (state) startTutorial(); },
  openRelics:  () => { if (state) _openRelicPicker(); },
  relicInfo:   () => state?.relics?.map(r => r.id),
};

