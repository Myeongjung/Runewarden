/* eslint-disable max-lines-per-function */
// HUD 렌더링 함수 모음 — GameEngine.js에서 분리
// GameState.shared 를 통해 런타임 상태에 접근합니다.

import { shared } from '../core/GameState.js';
import { i18n }   from '../i18n/i18n.js';
import { PASSIVES } from '../data/wardens.js';
import { TOWER_DEFS } from '../data/towers.js';
import { MAX_RANK } from '../systems/MetaSystem.js';
import { ACT_SIZE } from '../config/constants.js';

const $ = id => document.getElementById(id);

// ── 메뉴 랭크/통계 표시 ──────────────────────────────
export function updateMenuRank() {
  const { meta } = shared;
  const rankEl  = $('menu-rank-num');
  const fillEl  = $('menu-xp-fill');
  const runsEl  = $('menu-stat-runs');
  const winsEl  = $('menu-stat-wins');
  const killsEl = $('menu-stat-kills');
  if (!rankEl) return;

  rankEl.textContent  = meta.rank;
  runsEl.textContent  = i18n.t('stat_runs',  meta.runsPlayed);
  winsEl.textContent  = i18n.t('stat_wins',  meta.runsWon);
  killsEl.textContent = i18n.t('stat_kills', meta.totalKills);

  if (runsEl.dataset.i18nN !== undefined)  runsEl.dataset.i18nN  = meta.runsPlayed;
  if (winsEl.dataset.i18nN !== undefined)  winsEl.dataset.i18nN  = meta.runsWon;
  if (killsEl.dataset.i18nN !== undefined) killsEl.dataset.i18nN = meta.totalKills;

  const pct = meta.rank >= MAX_RANK ? 100 : meta.rankProgress * 100;
  requestAnimationFrame(() => { fillEl.style.width = pct.toFixed(1) + '%'; });

  const continueBtn = $('btn-continue');
  if (continueBtn) {
    let saveData = null;
    try { saveData = JSON.parse(localStorage.getItem('rw_autosave') || 'null'); } catch {}
    if (saveData?.v && saveData.wave > 0) {
      continueBtn.classList.remove('hidden');
      continueBtn.textContent = i18n.t('btn_continue', saveData.wave, saveData.mapIcon ?? '🗺️', saveData.mapName ?? '');
    } else {
      continueBtn.classList.add('hidden');
    }
  }
}

// ── 게임 내 HUD 전체 갱신 ────────────────────────────
export function updateHUD() {
  const { state, cardSystem, meta } = shared;
  const actNum    = Math.max(1, Math.ceil(state.wave / ACT_SIZE));
  const waveInAct = state.wave > 0 ? ((state.wave - 1) % ACT_SIZE) + 1 : 1;
  $('hud-wave').textContent = `A${actNum} W${waveInAct}/${ACT_SIZE}`;

  const heartsContainer = $('nexus-hearts');
  if (heartsContainer && state.nexusHp !== undefined) {
    const maxHp = state.maxNexusHp
      ?? (state.difficulty ? (state.warden.nexusHp + (meta.bonuses.nexusHp || 0) + state.difficulty.nexusHp) : 3);
    const currentCount = heartsContainer.querySelectorAll('.heart').length;
    if (currentCount !== Math.max(1, maxHp)) {
      heartsContainer.innerHTML = Array.from({ length: Math.max(1, maxHp) },
        (_, i) => `<span class="heart${i < state.nexusHp ? ' active' : ''}">♥</span>`
      ).join('');
    }
  }

  const w = state.warden;
  if (w) {
    const iconEl = $('hud-warden-icon');
    const nameEl = $('hud-warden-name');
    const actEl  = $('hud-act-badge');
    if (iconEl) {
      iconEl.textContent = w.icon;
      iconEl.title = `Passive: ${i18n.t(w.passiveKey)}`;
    }
    if (nameEl) nameEl.textContent = w.name;
    const diffIcon = state.difficulty?.icon ?? '';
    if (actEl)  actEl.textContent  = `ACT ${actNum} ${diffIcon}`;
  }
  $('hud-gold').textContent = state.gold;
  $('hud-deck').textContent = cardSystem?.deckCount ?? 0;

  // 상태 기반 HUD 피드백: 골드 0 경고, 덱 카드 수 경고
  $('hud-gold')?.classList.toggle('gold-empty', state.gold === 0 && state.phase !== 'over');
  const deckTotal = (cardSystem?.drawPile?.length ?? 0) + (cardSystem?.discardPile?.length ?? 0);
  $('hud-deck')?.classList.toggle('deck-low',  deckTotal > 0 && deckTotal <= 3);
  $('hud-deck')?.classList.toggle('deck-empty', deckTotal === 0 && state.phase !== 'over');

  const hearts = document.querySelectorAll('.heart');
  hearts.forEach((h, i) => { h.classList.toggle('active', i < state.nexusHp); });

  // QW#1: 넥서스 HP=1 → 지속 붉은 비네트
  $('map-area')?.classList.toggle(
    'nexus-critical',
    state.nexusHp === 1 && state.phase !== 'over'
  );

  renderHand();
}

// ── 카드 핸드 렌더링 ──────────────────────────────────
export function renderHand() {
  const { state, cardSystem } = shared;
  const handKey = [
    state?.gold ?? 0,
    state?.phase ?? '',
    state?.selectedCard?.uid ?? '',
    state?.ascMods?.extraSurcharge ?? 0,
    i18n.lang,
    cardSystem?.hand.map(c => c.uid).join(',') ?? '',
  ].join('|');
  if (handKey === shared._lastHandKey) return;
  shared._lastHandKey = handKey;

  const container = $('card-hand');
  container.innerHTML = '';

  const baseSurcharge = state.phase === 'wave' ? Math.min(2, 1 + (state.ascMods?.extraSurcharge ?? 0)) : 0;

  for (const card of cardSystem.hand) {
    const surcharge = (card.type === 'spell') ? 0 : baseSurcharge;
    const arcaneDiscount = (card.type === 'spell' && state?.warden?.passive === PASSIVES.ARCANE_FLOW) ? 1 : 0;
    const effectiveCost = Math.max(0, card.cost + surcharge - arcaneDiscount);
    const canAfford = effectiveCost <= state.gold;
    const isSelected = state.selectedCard?.uid === card.uid;
    const isKo = i18n.lang === 'ko';
    const cName = isKo ? (card.nameKo || card.name) : card.name;
    const cDesc = isKo ? (card.descKo || card.desc) : card.desc;
    const forgedBadge = card.forged ? ' <span class="forged-badge">⬆</span>' : '';

    const _cm = state.challengeMods;
    let isBanned = false;
    if (_cm) {
      if (_cm.bannedCardTypes?.includes(card.type)) isBanned = true;
      if (!isBanned && card.type === 'summon') {
        const tid = TOWER_DEFS[card.tower]?.id ?? card.tower;
        if (_cm.allowedTowers && !_cm.allowedTowers.includes(tid)) isBanned = true;
        if (_cm.bannedTowers?.includes(tid)) isBanned = true;
      }
    }

    const isCurse = card.type === 'curse';

    const el = document.createElement('div');
    el.className = `card${(!canAfford || isBanned || isCurse) ? ' unaffordable' : ''}${isSelected ? ' selected' : ''}${isBanned ? ' challenge-banned' : ''}${isCurse ? ' curse-card' : ''}`;
    el.dataset.rarity = card.rarity;
    el.dataset.type   = card.type;

    el.innerHTML = `
      <div class="card-header">
        <span class="card-name">${card.icon} ${cName}${forgedBadge}</span>
        <span class="card-cost">${isCurse ? '—' : (effectiveCost > 0 ? effectiveCost + 'g' : i18n.t('free').toUpperCase())}</span>
      </div>
      <div class="card-type-badge">${i18n.t('card_type_' + card.type) ?? card.type}${surcharge && !isCurse ? ' (' + i18n.t('card_surcharge_label') + ')' : ''}${isBanned ? ' 🚫' : ''}</div>
      <div class="card-desc">${cDesc}</div>
    `;

    if ((canAfford || isSelected) && !isBanned && !isCurse) {
      el.addEventListener('click', () => shared.onCardClick(card));
    }
    container.appendChild(el);
  }

  if (cardSystem.hand.length === 0) {
    container.innerHTML = `<div style="color:#555;font-size:0.8rem;padding:0.5rem;">${i18n.t('hand_empty')}</div>`;
  }
}

// ── 보스 HP 바 ────────────────────────────────────────
const WEAKNESS_ICONS = { fire: '🔥', frost: '❄️', lightning: '⚡', shadow: '🌑', solar: '☀️' };

export function onBossUpdate({ hp, maxHp, hidden, name, phase2, weakness }) {
  const wrap      = $('boss-hpbar-wrap');
  const fill      = $('boss-hpbar-fill');
  const text      = $('boss-hp-text');
  const nameLabel = $('boss-name-label');
  const iconEl    = $('boss-icon');
  if (!wrap) return;

  if (hidden || (hp === 0 && maxHp === 1)) {
    wrap.classList.add('hidden');
    return;
  }
  wrap.classList.remove('hidden');

  const weaknessBadge = weakness ? ` ${WEAKNESS_ICONS[weakness] ?? ''}${i18n.t('weakness_' + weakness)}` : '';

  const BOSS_HUD = {
    'Ironclad':        { key: 'boss_hud_ironclad',        icon: '💀', border: '#B8860B', grad: null },
    'Void Titan':      { key: 'boss_hud_void_titan',      icon: '🌑', border: '#9B59B6', grad: 'linear-gradient(90deg,#4A235A,#9B59B6)' },
    'Abyssal Dragon':  { key: 'boss_hud_abyssal_dragon',  icon: '🌀', border: '#330066', grad: 'linear-gradient(90deg,#0D0030,#5500AA)' },
    'Shadow Titan':    { key: 'boss_hud_shadow_titan',    icon: '👁️', border: '#2D0050', grad: 'linear-gradient(90deg,#1A0033,#6600AA)' },
    'Shadow Colossus': { key: 'boss_hud_shadow_colossus', icon: '☠️', border: '#1A0030', grad: 'linear-gradient(90deg,#0D0020,#440088)' },
    'Solar Titan':     { key: 'boss_hud_solar_titan',     icon: '🌟', border: '#E8791A', grad: 'linear-gradient(90deg,#7A2A00,#E8791A)' },
    'Sun God':         { key: 'boss_hud_sun_god',         icon: '☀️', border: '#F5C518', grad: 'linear-gradient(90deg,#7A5A00,#F5C518)' },
  };
  const bossInfo = BOSS_HUD[name] ?? BOSS_HUD['Ironclad'];
  const isPhase2 = name === 'Abyssal Dragon' && hp <= maxHp * 0.5;
  const phase2Suffix = isPhase2 ? i18n.t('boss_hud_phase2') + ' ❄️ FROST RESIST' : '';
  const displayName = i18n.t(bossInfo.key) + phase2Suffix + weaknessBadge;

  wrap.style.borderColor = isPhase2 ? '#FF00FF' : bossInfo.border;
  if (nameLabel) nameLabel.textContent = displayName;
  if (iconEl)    iconEl.textContent    = isPhase2 ? '🐉' : bossInfo.icon;

  if (isPhase2) {
    fill.style.background = 'linear-gradient(90deg,#330066,#FF00FF)';
  } else if (bossInfo.grad) {
    fill.style.background = bossInfo.grad;
  } else {
    const r = hp / maxHp;
    fill.style.background = r > 0.5 ? 'linear-gradient(90deg,#8B0000,#FFD700)'
                          : r > 0.2 ? 'linear-gradient(90deg,#8B0000,#FF6600)'
                          :            'linear-gradient(90deg,#8B0000,#FF0000)';
  }

  const pct = Math.max(0, (hp / maxHp) * 100).toFixed(1);
  fill.style.width = pct + '%';
  text.textContent = `${Math.max(0, Math.round(hp))} / ${maxHp}`;

  // Phase 2 전환 시 화면 플래시 (보라색)
  if (phase2) {
    const mapArea = document.getElementById('map-area');
    if (mapArea) {
      mapArea.classList.remove('screen-flash-phase2');
      void mapArea.offsetWidth;
      mapArea.classList.add('screen-flash-phase2');
    }
  }
}

// ── Shadow Charge HUD (DLC) ───────────────────────────
export function updateShadowChargeHUD() {
  const { state } = shared;
  let bar = document.getElementById('shadow-charge-bar');
  if (state?.warden?.passive !== 'shadow_charge') {
    if (bar) bar.style.display = 'none';
    return;
  }
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'shadow-charge-bar';
    bar.className = 'shadow-charge-bar';
    const hud = document.getElementById('hud');
    if (hud) hud.appendChild(bar);
  }
  bar.style.display = '';
  const charges = state.shadowCharges ?? 0;
  bar.innerHTML = `
    <div class="sc-label">👁️ ${charges}/10</div>
    <div class="sc-track">
      <div class="sc-fill" style="width:${charges * 10}%"></div>
    </div>
  `;
}

// ── 웨이브 클리어 배너 ────────────────────────────────
export function showClearBanner(waveNum, isBossStart = false, isActEnd = false) {
  const existing = document.getElementById('wave-clear-banner');
  existing?.remove();

  const banner  = document.createElement('div');
  banner.id     = 'wave-clear-banner';
  const actNum  = Math.ceil(waveNum / ACT_SIZE);
  const maxWaves = shared.maxWaves;

  if (isBossStart) {
    const BOSS_BANNER_KEY = {
      5: 'banner_boss_ironclad', 10: 'banner_boss_titan', 15: 'banner_boss_dragon',
      23: 'banner_boss_shadow_colossus', 28: 'banner_boss_solar_titan', 31: 'banner_boss_sun_god',
    };
    const bossName = i18n.t(BOSS_BANNER_KEY[waveNum] ?? 'banner_boss_dragon');
    banner.classList.add('boss-banner');
    banner.innerHTML = `
      ⚔️ ${i18n.t('banner_boss_act', actNum)} ⚔️
      <div class="banner-sub" style="color:#FFD700">${bossName}</div>
    `;
  } else if (waveNum >= maxWaves) {
    banner.classList.add('victory-banner');
    banner.innerHTML = `
      ${i18n.t('banner_victory')}
      <div class="banner-sub">${i18n.t('banner_all_clear')}</div>
    `;
  } else if (isActEnd) {
    banner.classList.add('act-clear-banner');
    banner.innerHTML = `
      ${i18n.t('banner_act_clear', actNum)}
      <div class="banner-sub">${i18n.t('banner_act_next', actNum + 1)}</div>
    `;
  } else {
    banner.innerHTML = `
      ${i18n.t('banner_wave_clear', waveNum)}
      <div class="banner-sub">${i18n.t('banner_entering_shop')}</div>
    `;
  }

  document.body.appendChild(banner);
  const dur = (isBossStart || isActEnd) ? 2200 : 1100;
  setTimeout(() => banner.remove(), dur);
}

// ── 기습 경고 배너 ────────────────────────────────────
export function showAmbushBanner(delayMs) {
  const existing = document.getElementById('ambush-banner');
  existing?.remove();
  const banner = document.createElement('div');
  banner.id = 'ambush-banner';
  banner.className = 'ambush-banner';
  banner.textContent = i18n.t('banner_ambush');
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), delayMs);
}
