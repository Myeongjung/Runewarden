/* eslint-disable max-lines-per-function */
// 화면 전환·선택 UI 함수 모음 — GameEngine.js에서 분리
// GameState.shared 를 통해 런타임 상태에 접근합니다.

import { shared } from '../core/GameState.js';
import { updateMenuRank } from './HUDUpdater.js';
import { i18n }    from '../i18n/i18n.js';
import { audio, music } from '../systems/AudioSystem.js';
import { WARDEN_DEFS } from '../data/wardens.js';
import { DIFFICULTY_DEFS, getDifficultyById } from '../data/difficulty.js';
import { ASCENSION_DEFS } from '../data/ascension.js';
import { CHALLENGE_DEFS, getChallengeXPBonus } from '../data/challenges.js';
import { CODEX_UNLOCKS, xpForLevel, MAX_RANK } from '../systems/MetaSystem.js';

const $ = id => document.getElementById(id);

// ── 화면 전환 ─────────────────────────────────────────
export function showScreen(name) {
  const { screens } = shared;
  Object.values(screens).forEach(s => { if (s) { s.classList.remove('active'); s.style.display = ''; } });
  ['screen-howto','screen-gameover','screen-summary',
   'screen-node','screen-shop','screen-event','screen-rest','screen-pause',
   'screen-relic','screen-difficulty',
  ].forEach(id => $(id)?.classList.add('hidden'));

  if (name === 'menu') {
    screens.menu.classList.add('active');
    screens.menu.style.display = 'flex';
    updateMenuRank();
    music.crossfadeTo('menu');
  }
  if (name === 'game')  { screens.game.classList.add('active'); screens.game.style.display = 'flex'; }
  if (name === 'howto') { $('screen-howto').classList.remove('hidden'); }
  if (name === 'gameover') { screens.gameover.classList.remove('hidden'); music.crossfadeTo('menu'); }
}

// ── Warden 선택 화면 ──────────────────────────────────
export function openWardenSelect() {
  const { meta, steam } = shared;
  const overlay = $('screen-warden-select');
  const row     = $('warden-cards-row');
  overlay.classList.remove('hidden');
  row.innerHTML = '';

  // 첫 런 플레이어를 위한 Quick Start 배너
  overlay.querySelector('.first-run-banner')?.remove();
  if (meta.runsPlayed === 0) {
    const isKo = i18n.lang === 'ko';
    const banner = document.createElement('div');
    banner.className = 'first-run-banner';
    banner.innerHTML = `
      <div class="first-run-label">🔰 ${isKo ? '처음 플레이하시나요?' : 'First time?'}</div>
      <button class="btn-primary first-run-btn" id="btn-quick-start">
        ▶ ${isKo ? '추천 설정으로 바로 시작' : 'Quick Start (Recommended)'}
      </button>
      <div class="first-run-sub">${isKo ? 'Iron Warden · Standard 난이도 · 최적 입문 설정' : 'Iron Warden · Standard · Best for beginners'}</div>
    `;
    const header = overlay.querySelector('.warden-select-header');
    if (header) header.after(banner);
    document.getElementById('btn-quick-start')?.addEventListener('click', () => {
      shared.selectedWarden     = WARDEN_DEFS[0];
      shared.selectedDifficulty = getDifficultyById('standard');
      shared.selectedAscension  = 0;
      shared.selectedChallenges = [];
      overlay.classList.add('hidden');
      shared.startRun();
    });
  }

  for (const w of WARDEN_DEFS) {
    const isDlcLocked = w.dlc ? !(steam?.isDlcOwned(w.dlc) ?? false) : false;
    const isRankLocked = meta.rank < w.unlockRank;
    const isLocked   = isRankLocked || isDlcLocked;
    const isSelected = shared.selectedWarden.id === w.id;

    const card = document.createElement('div');
    card.className = `warden-card${isLocked ? ' locked' : ''}${isSelected ? ' selected' : ''}${isDlcLocked ? ' dlc-locked' : ''}`;
    card.style.setProperty('--warden-color', w.color);
    card.style.setProperty('--warden-bg', w.accentBg);

    const deckSize = w.buildDeck ? w.buildDeck().length : 0;
    const btnLabel = isDlcLocked
      ? (i18n.t('dlc_sr_warden_locked') ?? 'DLC Required')
      : isRankLocked
        ? i18n.t('warden_locked', w.unlockRank)
        : isSelected ? i18n.t('warden_selected') : i18n.t('warden_select_btn');

    card.innerHTML = `
      ${isDlcLocked
        ? `<div class="warden-lock-badge dlc-badge">💠 DLC</div>`
        : isRankLocked
          ? `<div class="warden-lock-badge">🔒 Rank ${w.unlockRank}</div>`
          : ''
      }
      <div class="warden-card-head">
        <div class="warden-icon">${w.icon}</div>
        <div class="warden-head-text">
          <div class="warden-name">${w.name}</div>
          <div class="warden-title">${w.title}</div>
        </div>
      </div>
      <div class="warden-tagline">${w.tagline}</div>
      <div class="warden-desc">${typeof w.desc === 'object' ? (w.desc[i18n.lang] ?? w.desc.en) : w.desc}</div>
      <div class="warden-stats">
        <div class="warden-stat">🪙<span class="warden-stat-val">${w.startGold}g</span></div>
        <div class="warden-stat">🤚<span class="warden-stat-val">${w.handSize}</span></div>
        <div class="warden-stat">♥<span class="warden-stat-val">${w.nexusHp}HP</span></div>
        <div class="warden-stat">🃏<span class="warden-stat-val">${deckSize}</span></div>
      </div>
      <div class="warden-passive-box">
        <span class="warden-passive-label">${i18n.t('passive_label')}</span>
        ${i18n.t(w.passiveKey)}
      </div>
      <button class="warden-select-btn" ${isLocked ? 'disabled' : ''}>${btnLabel}</button>
    `;

    if (!isLocked) {
      card.querySelector('.warden-select-btn').addEventListener('click', () => {
        shared.selectedWarden = w;
        overlay.classList.add('hidden');
        openDifficultySelect();
      });
      // 워든 카드 호버 시 오버레이 배경 미리보기
      card.addEventListener('mouseenter', () => {
        overlay.style.background = `radial-gradient(ellipse at 50% 30%, ${w.accentBg.replace('linear-gradient(135deg,', '').split(',')[0].trim()} 0%, #0D0030 65%)`;
      });
      card.addEventListener('mouseleave', () => {
        overlay.style.background = '';
      });
    }
    row.appendChild(card);
  }
}

// ── 난이도 선택 화면 ──────────────────────────────────
export function openDifficultySelect() {
  const { meta } = shared;
  const overlay = $('screen-difficulty');
  overlay.classList.remove('hidden');

  const maxAsc = meta.maxSelectableAscension;

  const ascHTML = maxAsc > 0 ? `
    <div class="asc-section">
      <div class="asc-section-title">${i18n.t('asc_section_title')}</div>
      <div class="asc-section-sub">${i18n.t('asc_section_sub')}</div>
      <div class="asc-choices">
        <div class="asc-btn${shared.selectedAscension === 0 ? ' selected' : ''}" data-asc="0">
          <span class="asc-btn-icon">✕</span>
          <span class="asc-btn-label">${i18n.t('asc_off')}</span>
        </div>
        ${ASCENSION_DEFS.map(a => {
          const isAvail = a.level <= maxAsc;
          const isSel   = shared.selectedAscension === a.level;
          return `<div class="asc-btn${isSel ? ' selected' : ''}${isAvail ? '' : ' locked'}" data-asc="${a.level}">
            <span class="asc-btn-icon">${a.icon}</span>
            <span class="asc-btn-label">${i18n.t('asc_' + a.level + '_title')}${isAvail ? '' : ' 🔒'}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="asc-desc" id="asc-desc-text">
        ${shared.selectedAscension === 0
          ? i18n.t('asc_off_desc')
          : i18n.t('asc_' + shared.selectedAscension + '_desc')}
      </div>
    </div>
  ` : '';

  const catLabels = { tower: i18n.t('ch_cat_tower'), card: i18n.t('ch_cat_card'), economy: i18n.t('ch_cat_economy'), run: i18n.t('ch_cat_run') };
  const cats = ['tower', 'card', 'economy', 'run'];
  const challengeHTML = `
    <div class="challenge-section">
      <div class="challenge-section-header" id="challenge-toggle-btn">
        <span>${i18n.t('challenge_section_title')}</span>
        <span class="challenge-xp-badge" id="challenge-xp-total">${
          shared.selectedChallenges.length ? i18n.t('challenge_xp_bonus', Math.round(getChallengeXPBonus(shared.selectedChallenges) * 100)) : i18n.t('challenge_xp_none')
        }</span>
        <span class="challenge-toggle-arrow" id="challenge-arrow">▶</span>
      </div>
      <div class="challenge-panel hidden" id="challenge-panel">
        ${cats.map(cat => {
          const defs = CHALLENGE_DEFS.filter(c => c.category === cat);
          return `<div class="challenge-cat">
            <div class="challenge-cat-label">${catLabels[cat]}</div>
            <div class="challenge-btn-row">
              ${defs.map(c => `
                <div class="challenge-btn${shared.selectedChallenges.includes(c.id) ? ' active' : ''}" data-cid="${c.id}"
                     title="${i18n.t('ch_' + c.id + '_desc')}">
                  <span class="ch-icon">${c.icon}</span>
                  <span class="ch-name">${i18n.t('ch_' + c.id + '_name')}</span>
                  <span class="ch-xp">+${Math.round(c.xpBonus * 100)}%</span>
                </div>
              `).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  overlay.innerHTML = `
    <div class="difficulty-box" style="animation:shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)">
      <div class="difficulty-header">
        <div class="difficulty-title">${i18n.t('difficulty_title')}</div>
        <div class="difficulty-sub">${i18n.t('difficulty_sub')}</div>
      </div>
      <div class="difficulty-choices">
        ${DIFFICULTY_DEFS.map(d => `
          <div class="diff-card${d.id === shared.selectedDifficulty.id ? ' selected' : ''}" data-id="${d.id}">
            <div class="diff-icon">${d.icon}</div>
            <div class="diff-body">
              <div class="diff-name">${i18n.t('diff_' + d.id)}</div>
              <div class="diff-desc">${i18n.t('diff_' + d.id + '_desc')}</div>
            </div>
          </div>
        `).join('')}
      </div>
      ${ascHTML}
      ${challengeHTML}
      <div class="diff-footer">
        <button class="btn-secondary" id="diff-back">${i18n.t('diff_back')}</button>
        <button class="btn-primary"   id="diff-confirm">${i18n.t('diff_confirm')}</button>
      </div>
    </div>
  `;

  overlay.querySelectorAll('.diff-card').forEach(el => {
    el.addEventListener('click', () => {
      overlay.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      shared.selectedDifficulty = getDifficultyById(el.dataset.id);
    });
  });

  overlay.querySelectorAll('.asc-btn:not(.locked)').forEach(el => {
    el.addEventListener('click', () => {
      overlay.querySelectorAll('.asc-btn').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      shared.selectedAscension = parseInt(el.dataset.asc, 10);
      const descEl = overlay.querySelector('#asc-desc-text');
      if (descEl) {
        descEl.textContent = shared.selectedAscension === 0
          ? i18n.t('asc_off_desc')
          : i18n.t('asc_' + shared.selectedAscension + '_desc');
      }
    });
  });

  overlay.querySelector('#challenge-toggle-btn').addEventListener('click', () => {
    const panel = overlay.querySelector('#challenge-panel');
    const arrow = overlay.querySelector('#challenge-arrow');
    panel.classList.toggle('hidden');
    arrow.textContent = panel.classList.contains('hidden') ? '▶' : '▼';
  });

  overlay.querySelectorAll('.challenge-btn').forEach(el => {
    el.addEventListener('click', () => {
      const cid = el.dataset.cid;
      if (shared.selectedChallenges.includes(cid)) {
        shared.selectedChallenges = shared.selectedChallenges.filter(id => id !== cid);
        el.classList.remove('active');
      } else {
        shared.selectedChallenges.push(cid);
        el.classList.add('active');
      }
      const bonus = getChallengeXPBonus(shared.selectedChallenges);
      const xpEl = overlay.querySelector('#challenge-xp-total');
      if (xpEl) xpEl.textContent = bonus > 0
        ? i18n.t('challenge_xp_bonus', Math.round(bonus * 100))
        : i18n.t('challenge_xp_none');
    });
  });

  $('diff-back').addEventListener('click', () => {
    overlay.classList.add('hidden');
    openWardenSelect();
  });

  $('diff-confirm').addEventListener('click', () => {
    overlay.classList.add('hidden');
    shared.startRun();
  });
}

// ── 덱 뷰 오버레이 ────────────────────────────────────
export function openDeckView() {
  const { cardSystem } = shared;
  if (!cardSystem) return;
  const overlay = $('screen-deck-view');
  if (!overlay) return;

  const all  = [...cardSystem.drawPile, ...cardSystem.discardPile];
  const isKo = i18n.lang === 'ko';

  const groups = { summon: [], augment: [], spell: [] };
  for (const card of all) {
    if (groups[card.type] !== undefined) groups[card.type].push(card);
    else groups.summon.push(card);
  }

  const typeLabel = type => i18n.t('card_type_' + type) ?? type;
  const renderGroup = (type, cards) => {
    if (!cards.length) return '';
    const items = cards.map(c => {
      const name = isKo ? (c.nameKo || c.name) : c.name;
      return `<div class="deck-card-item" data-rarity="${c.rarity}">${c.icon} ${name} <span class="deck-card-cost">${c.cost}g</span></div>`;
    }).join('');
    return `<div class="deck-section">
      <div class="deck-section-title">${typeLabel(type)} (${cards.length})</div>
      <div class="deck-card-list">${items}</div>
    </div>`;
  };

  overlay.innerHTML = `
    <div class="deck-view-box">
      <div class="deck-view-header">
        <div class="deck-view-title">🃏 ${isKo ? '현재 덱' : 'Your Deck'} (${all.length})</div>
        <div class="deck-view-piles">
          <span>${isKo ? '드로우' : 'Draw'}: ${cardSystem.drawPile.length}</span>
          &nbsp;|&nbsp;
          <span>${isKo ? '버림' : 'Discard'}: ${cardSystem.discardPile.length}</span>
        </div>
        <button class="deck-view-close" id="btn-deck-close">✕</button>
      </div>
      <div class="deck-view-content">
        ${renderGroup('summon', groups.summon)}
        ${renderGroup('augment', groups.augment)}
        ${renderGroup('spell',   groups.spell)}
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');

  const close = () => {
    overlay.classList.add('hidden');
    document.removeEventListener('keydown', escHandler);
  };
  const escHandler = (e) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); } };
  $('btn-deck-close').addEventListener('click', close);
  document.addEventListener('keydown', escHandler);
}

// ── Codex 화면 ────────────────────────────────────────
export function openCodex() {
  const { meta } = shared;
  const container = $('screen-codex');
  container.classList.remove('hidden');

  const rank    = meta.rank;
  const totalXP = meta.totalXP;
  const pct     = rank >= MAX_RANK ? 100 : (meta.rankProgress * 100).toFixed(1);
  const nextXP  = rank >= MAX_RANK ? 0 : xpForLevel(rank + 1) - totalXP;

  container.innerHTML = `
    <div class="codex-box" style="animation: shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)">
      <div class="codex-header">
        <div class="codex-title">📖 ${i18n.t('btn_codex').replace(/^📖\s*/, '')}</div>
        <div class="codex-rank-badge">⚜️ ${i18n.t('warden_rank')} ${rank}${rank >= MAX_RANK ? ' · MAX' : ''}</div>
      </div>
      <div class="codex-xp-section">
        <div class="codex-xp-bar-track">
          <div class="codex-xp-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="codex-xp-labels">
          <span>${i18n.t('rank_num', rank)} · ${totalXP} XP</span>
          <span>${rank < MAX_RANK ? i18n.t('codex_xp_to', nextXP, rank + 1) : i18n.t('codex_max_rank')}</span>
        </div>
      </div>
      <div class="codex-stats">
        <div class="codex-stat-item"><span>${meta.runsPlayed}</span> ${i18n.t('codex_stat_runs')}</div>
        <div class="codex-stat-item"><span>${meta.runsWon}</span> ${i18n.t('codex_stat_wins')}</div>
        <div class="codex-stat-item"><span>${meta.totalKills}</span> ${i18n.t('codex_stat_slain')}</div>
        <div class="codex-stat-item"><span>${meta.runsPlayed > 0 ? ((meta.runsWon/meta.runsPlayed)*100).toFixed(0) : 0}%</span> ${i18n.t('codex_stat_winrate')}</div>
      </div>
      <div class="codex-grid">
        ${CODEX_UNLOCKS.map(u => _buildCodexItem(u, rank)).join('')}
      </div>
      ${_buildCodexRunHistory(meta)}
      <div class="codex-footer">
        <button class="btn-primary codex-close-btn" id="btn-codex-close">${i18n.t('howto_close')}</button>
      </div>
    </div>
  `;

  $('btn-codex-close').addEventListener('click', () => {
    container.classList.add('hidden');
  });
}

function _buildCodexRunHistory(meta) {
  const history = meta.runHistory;
  if (!history?.length) return '';
  const isKo = i18n.lang === 'ko';
  const items = history.map(r => {
    const result = r.victory ? '✅' : '❌';
    const asc    = r.ascension > 0 ? ` ⚡${r.ascension}` : '';
    return `<div class="run-history-item">
      <span class="rhi-result">${result}</span>
      <span>${r.wardenIcon ?? '🛡️'} ${r.wardenName ?? r.wardenId}</span>
      <span>${r.diffIcon ?? ''} ${r.diffName ?? r.diffId}</span>
      <span>W${r.wavesCleared}${asc}</span>
    </div>`;
  }).join('');
  return `<div class="codex-run-history">
    <div class="codex-run-history-title">${isKo ? '최근 런' : 'Recent Runs'}</div>
    <div class="codex-run-history-list">${items}</div>
  </div>`;
}

function _buildCodexItem(unlock, currentRank) {
  const isUnlocked = currentRank >= unlock.rank;
  return `
    <div class="codex-item ${isUnlocked ? 'unlocked' : 'locked'}">
      ${isUnlocked ? '<div class="codex-unlock-glow"></div>' : ''}
      ${!isUnlocked ? '<span class="codex-lock-icon">🔒</span>' : ''}
      <div class="codex-item-icon">${unlock.icon}</div>
      <div class="codex-item-name">${i18n.lang === 'ko' ? (unlock.titleKo || unlock.title) : unlock.title}</div>
      <div class="codex-item-rank ${isUnlocked ? 'unlocked-rank' : ''}">
        ${isUnlocked ? i18n.t('codex_unlocked', unlock.rank) : i18n.t('codex_locked', unlock.rank)}
      </div>
      <div class="codex-item-desc">${i18n.lang === 'ko' ? (unlock.descKo || unlock.desc) : unlock.desc}</div>
    </div>
  `;
}
