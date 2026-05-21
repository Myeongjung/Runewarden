// 웨이브 클리어 후 노드 선택 + 이벤트/휴식 UI
import { CARD_DEFS } from '../data/cards.js';
import { i18n } from '../i18n/i18n.js';

// ── NodeSelectionUI ───────────────────────────────────
export class NodeSelectionUI {
  constructor(container, callbacks) {
    this.container = container;
    this.onShop  = callbacks.onShop;
    this.onEvent = callbacks.onEvent;
    this.onRest  = callbacks.onRest;
  }

  open(waveNum, gold) {
    this.container.classList.remove('hidden');
    this.container.innerHTML = `
      <div class="node-box">
        <div class="node-header">
          <span class="node-title">${i18n.t('node_title')}</span>
          <span class="node-sub">${i18n.t('node_after_wave', waveNum)}</span>
        </div>
        <div class="node-gold-bar">
          <span>${i18n.t('node_gold_display', gold)}</span>
        </div>
        <div class="node-choices">
          <div class="node-card" id="node-shop">
            <div class="node-hint-badge node-hint-economy">💰 ${i18n.t('node_hint_economy')}</div>
            <div class="node-card-icon">🏪</div>
            <div class="node-card-name">${i18n.t('node_shop')}</div>
            <div class="node-card-desc">${i18n.t('node_shop_desc2')}</div>
            <div class="node-card-tag">${i18n.t('node_merchant')}</div>
          </div>
          <div class="node-card" id="node-event">
            <div class="node-hint-badge node-hint-mystery">🔮 ${i18n.t('node_hint_mystery')}</div>
            <div class="node-card-icon">⚡</div>
            <div class="node-card-name">${i18n.t('node_event')}</div>
            <div class="node-card-desc">${i18n.t('node_event_desc2')}</div>
            <div class="node-card-tag">${i18n.t('node_unknown')}</div>
          </div>
          <div class="node-card" id="node-rest">
            <div class="node-hint-badge node-hint-rest">💆 ${i18n.t('node_hint_rest')}</div>
            <div class="node-card-icon">🛌</div>
            <div class="node-card-name">${i18n.t('node_rest')}</div>
            <div class="node-card-desc">${i18n.t('node_rest_desc2')}</div>
            <div class="node-card-tag">${i18n.t('node_sanctuary')}</div>
          </div>
        </div>
      </div>
    `;

    // 입장 애니메이션
    const box = this.container.querySelector('.node-box');
    box.style.animation = 'shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';

    this.container.querySelector('#node-shop').addEventListener('click', () => {
      this._close(); this.onShop();
    });
    this.container.querySelector('#node-event').addEventListener('click', () => {
      this._close(); this.onEvent();
    });
    this.container.querySelector('#node-rest').addEventListener('click', () => {
      this._close(); this.onRest();
    });
  }

  _close() { this.container.classList.add('hidden'); }
}

// ── EventUI ───────────────────────────────────────────
export class EventUI {
  constructor(container, callbacks) {
    this.container = container;
    this.onEffect = callbacks.onEffect;
    this.onClose  = callbacks.onClose;
    this.onLog    = callbacks.onLog;
  }

  open() {
    // 현재 언어의 이벤트 풀 사용
    const events = i18n.t('events');
    const event  = events[Math.floor(Math.random() * events.length)];
    this.container.classList.remove('hidden');

    this.container.innerHTML = `
      <div class="event-box">
        <div class="event-icon">${event.icon}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-flavor">"${event.flavor}"</div>
        <div class="event-choices">
          ${event.choices.map((c, i) => `
            <div class="event-choice" data-idx="${i}">
              <div class="event-choice-label">${c.label}</div>
              <div class="event-choice-desc">${c.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const box = this.container.querySelector('.event-box');
    box.style.animation = 'shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';

    this.container.querySelectorAll('.event-choice').forEach((el, i) => {
      el.addEventListener('click', () => {
        const choice = event.choices[i];
        this.onLog(i18n.t('event_log', event.title, choice.label));
        this.onEffect(choice.effect);
        this.container.classList.add('hidden');
        this.onClose();
      });
    });
  }
}

// ── RestUI ────────────────────────────────────────────
export class RestUI {
  constructor(container, callbacks) {
    this.container = container;
    this.onRemoveCard  = callbacks.onRemoveCard;   // (cardUid) → void
    this.onGoldBonus   = callbacks.onGoldBonus;    // (amount)  → void
    this.onClose       = callbacks.onClose;
    this.onLog         = callbacks.onLog;
    this._deck = [];
    this._mode = null;   // 'remove' | null
  }

  open(deckCards, gold) {
    this._deck = deckCards;
    this._mode = null;
    this.container.classList.remove('hidden');
    this._render(gold);

    const box = this.container.querySelector('.rest-box');
    if (box) box.style.animation = 'shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  }

  _render(gold) {
    const scavengeGold = 8;
    this.container.innerHTML = `
      <div class="rest-box">
        <div class="rest-header">
          <span class="rest-icon">🛌</span>
          <span class="rest-title">${i18n.t('rest_site')}</span>
          <span class="node-gold-inline">💰 ${gold}</span>
        </div>
        <p class="rest-subtitle">${i18n.t('rest_subtitle2')}</p>

        <div class="rest-options">
          <div class="rest-option" id="rest-remove">
            <div class="rest-opt-icon">🗑️</div>
            <div class="rest-opt-name">${i18n.t('rest_remove_card')}</div>
            <div class="rest-opt-desc">${i18n.t('rest_remove_desc')}</div>
          </div>
          <div class="rest-option" id="rest-gold">
            <div class="rest-opt-icon">💰</div>
            <div class="rest-opt-name">${i18n.t('rest_scavenge')}</div>
            <div class="rest-opt-desc">${i18n.t('rest_scavenge_desc', scavengeGold)}</div>
          </div>
        </div>

        <div id="rest-deck-picker" class="rest-deck-picker hidden">
          <div class="rest-pick-label">${i18n.t('rest_choose_card')}</div>
          <div id="rest-deck-list" class="rest-deck-list"></div>
          <button id="rest-cancel" class="btn-secondary rest-cancel-btn">${i18n.t('rest_cancel')}</button>
        </div>

        <button id="rest-leave" class="btn-primary rest-leave-btn">${i18n.t('rest_leave')}</button>
      </div>
    `;

    this._scavengeGold = scavengeGold;
    this.container.querySelector('#rest-remove').addEventListener('click', () => this._showDeckPicker());
    this.container.querySelector('#rest-gold').addEventListener('click', () => this._takeGold());
    this.container.querySelector('#rest-leave').addEventListener('click', () => this._close());
    this.container.querySelector('#rest-cancel')?.addEventListener('click', () => this._hideDeckPicker());
  }

  _showDeckPicker() {
    const picker = this.container.querySelector('#rest-deck-picker');
    picker.classList.remove('hidden');

    const list = this.container.querySelector('#rest-deck-list');
    list.innerHTML = '';

    const allCards = [...this._deck];
    if (allCards.length === 0) {
      list.innerHTML = `<div class="rest-empty">${i18n.t('rest_deck_empty')}</div>`;
      return;
    }

    for (const card of allCards) {
      const el = document.createElement('div');
      el.className = 'rest-card-item';
      el.dataset.rarity = card.rarity;
      const _rName = i18n.lang === 'ko' ? (card.nameKo || card.name) : card.name;
      el.innerHTML = `
        <span class="rest-card-icon">${card.icon}</span>
        <span class="rest-card-name">${_rName}</span>
        <span class="rest-card-type">${i18n.t('card_type_' + card.type) ?? card.type}</span>
        <button class="btn-remove-card">${i18n.t('card_btn_remove')}</button>
      `;
      el.querySelector('.btn-remove-card').addEventListener('click', () => {
        this.onRemoveCard(card.uid);
        this.onLog(i18n.t('rest_removed', _rName), 'good');
        this._close();
      });
      list.appendChild(el);
    }
  }

  _hideDeckPicker() {
    this.container.querySelector('#rest-deck-picker')?.classList.add('hidden');
  }

  _takeGold() {
    const g = this._scavengeGold ?? 8;
    this.onGoldBonus(g);
    this.onLog(i18n.t('rest_scavenged', g), 'gold');
    this._close();
  }

  _close() {
    this.container.classList.add('hidden');
    this.onClose();
  }
}

// ── 카드 풀에서 희귀도별 랜덤 추출 ────────────────────
export function pickRandomCards(count, rarity) {
  const pool = rarity === 'any'
    ? [...CARD_DEFS]
    : CARD_DEFS.filter(c => c.rarity === rarity);

  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push({ ...pool.splice(idx, 1)[0], uid: Math.random() });
  }
  return result;
}
