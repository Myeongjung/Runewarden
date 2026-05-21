/**
 * RelicUI — 유물 선택 오버레이 + HUD 유물 바
 *
 * 사용법:
 *   const relicUI = new RelicUI($('screen-relic'), {
 *     onPick: (relic) => { ... },
 *   });
 *   relicUI.openPicker(relicChoices);   // 런 시작 시 3개 선택지
 *   relicUI.updateHUD(state.relics);    // HUD 유물 아이콘 갱신
 */
import { i18n } from '../i18n/i18n.js';

export class RelicUI {
  constructor(container, callbacks) {
    this.container = container;
    this.onPick = callbacks.onPick;
    this._hudEl = null;
  }

  // ── 런 시작 유물 선택 오버레이 ──────────────────────
  openPicker(choices) {
    this.container.classList.remove('hidden');
    this.container.innerHTML = `
      <div class="relic-picker-box">
        <div class="relic-picker-header">
          <div class="relic-picker-title">${i18n.t('relic_pick_title')}</div>
          <div class="relic-picker-sub">${i18n.t('relic_pick_sub')}</div>
        </div>
        <div class="relic-choices">
          ${choices.map(r => this._buildRelicCard(r)).join('')}
        </div>
      </div>
    `;

    const box = this.container.querySelector('.relic-picker-box');
    box.style.animation = 'shopSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)';

    this.container.querySelectorAll('.relic-choice-card').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.relicId;
        const relic = choices.find(r => r.id === id);
        if (!relic) return;
        this.container.classList.add('hidden');
        this.onPick(relic);
      });
    });
  }

  _buildRelicCard(relic) {
    const name = i18n.t('relic_' + relic.id);
    const desc = i18n.t('relic_' + relic.id + '_desc');
    const rarityLabel = i18n.t('rarity_' + relic.rarity);
    return `
      <div class="relic-choice-card" data-relic-id="${relic.id}" data-rarity="${relic.rarity}">
        <div class="relic-card-icon">${relic.icon}</div>
        <div class="relic-card-body">
          <div class="relic-card-name">${name}</div>
          <div class="relic-card-rarity rarity-${relic.rarity}">${rarityLabel}</div>
          <div class="relic-card-desc">${desc}</div>
        </div>
      </div>
    `;
  }

  // ── HUD 유물 바 초기화 ───────────────────────────────
  initHUD(hudParent) {
    this._hudEl = document.createElement('div');
    this._hudEl.id = 'relic-hud-bar';
    this._hudEl.className = 'relic-hud-bar';
    hudParent.appendChild(this._hudEl);
  }

  // ── HUD 유물 아이콘 갱신 ────────────────────────────
  updateHUD(relics) {
    if (!this._hudEl) return;
    this._hudEl.innerHTML = relics.map(r => {
      const name = i18n.t('relic_' + r.id);
      const desc = i18n.t('relic_' + r.id + '_desc');
      return `
        <div class="relic-hud-icon" data-rarity="${r.rarity}" title="${name}: ${desc}">
          ${r.icon}
        </div>
      `;
    }).join('');
  }
}
