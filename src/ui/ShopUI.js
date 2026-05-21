// 웨이브 간 상점 UI
import { CARD_DEFS } from '../data/cards.js';
import { i18n } from '../i18n/i18n.js';

const SHOP_SIZE    = 3;   // 카드 슬롯 수
const REROLL_COST  = 2;
const MAX_REROLLS  = 2;

export class ShopUI {
  constructor(container, callbacks) {
    this.container = container;   // overlay div
    this.onBuy   = callbacks.onBuy;
    this.onLeave = callbacks.onLeave;
    this.onLog   = callbacks.onLog;

    this._gold     = 0;
    this._rerolls  = 0;
    this._offered  = [];   // 현재 진열된 카드 정의
    this._waveNum  = 0;

    this._build();
  }

  // ── DOM 구성 ────────────────────────────────────────
  _build() {
    this.container.innerHTML = `
      <div class="shop-box">
        <div class="shop-header">
          <div class="shop-title">
            <span class="shop-icon">🏪</span>
            <span>${i18n.t('shop_title')}</span>
            <span class="shop-wave" id="shop-wave-label"></span>
          </div>
          <div class="shop-gold-display">
            <span class="shop-gold-icon">💰</span>
            <span id="shop-gold-val">0</span>
          </div>
        </div>

        <p class="shop-subtitle">${i18n.t('shop_subtitle')}</p>

        <div id="shop-cards" class="shop-cards"></div>

        <div class="shop-footer">
          <button id="shop-reroll" class="btn-reroll">
            ${i18n.t('shop_reroll')} <span id="reroll-cost">(2g)</span>
            <span id="reroll-remaining" class="reroll-remain"></span>
          </button>
          <button id="shop-leave" class="btn-primary shop-leave-btn">
            ${i18n.t('shop_leave')}
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#shop-reroll').addEventListener('click', () => this._reroll());
    this.container.querySelector('#shop-leave').addEventListener('click', () => this.onLeave());
  }

  // ── 상점 열기 ─────────────────────────────────────
  open(gold, waveNum, unlockedCardIds = null, discount = 0, freeRerolls = 0, shopSize = SHOP_SIZE) {
    this._gold        = gold;
    this._waveNum     = waveNum;
    this._rerolls     = 0;
    this._freeRerolls = freeRerolls;      // Merchant's Ring 무료 리롤 횟수
    this._shopSize    = shopSize;         // Ascension I: 2장, 기본: 3장
    this._unlockedIds = unlockedCardIds;  // null = 모두 허용
    this._discount    = discount;         // Gold Lens 유물 할인

    this.container.classList.remove('hidden');
    this.container.querySelector('#shop-wave-label').textContent = i18n.t('shop_after_wave', waveNum);
    this._offer();
    this._refreshGold();
    this._refreshRerollBtn();

    // 입장 애니메이션
    const box = this.container.querySelector('.shop-box');
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = 'shopSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  }

  close() {
    this.container.classList.add('hidden');
    this._offered = [];
  }

  // 골드 갱신 (외부에서 호출)
  updateGold(gold) {
    this._gold = gold;
    this._refreshGold();
    this._refreshCardAffordability();
  }

  // ── 카드 진열 ─────────────────────────────────────
  _offer() {
    // Codex 언락 기준으로 카드 풀 필터링
    // __all_uncommon__, __all_rare__ 특수 토큰 처리
    let pool;
    if (!this._unlockedIds) {
      pool = [...CARD_DEFS];
    } else {
      const allUncommon = this._unlockedIds.includes('__all_uncommon__');
      const allRare     = this._unlockedIds.includes('__all_rare__');
      pool = CARD_DEFS.filter(c => {
        if (this._unlockedIds.includes(c.id)) return true;
        if (allUncommon && c.rarity === 'uncommon') return true;
        if (allRare     && c.rarity === 'rare')     return true;
        return false;
      });
    }

    // 풀이 너무 작으면 전체에서 보충
    const size = this._shopSize ?? SHOP_SIZE;
    if (pool.length < size) pool = [...CARD_DEFS];

    this._offered = [];
    const used = new Set();
    for (let i = 0; i < size && pool.length > 0; i++) {
      // 같은 카드 ID 중복 방지
      let idx, card, tries = 0;
      do {
        idx  = Math.floor(Math.random() * pool.length);
        card = pool[idx];
        tries++;
      } while (used.has(card.id) && tries < 20);
      used.add(card.id);
      pool.splice(idx, 1);
      this._offered.push({ ...card, uid: Math.random() });
    }
    this._renderCards();
  }

  _renderCards() {
    const container = this.container.querySelector('#shop-cards');
    container.innerHTML = '';

    for (const card of this._offered) {
      if (card._bought) {
        const slot = document.createElement('div');
        slot.className = 'shop-card-slot sold';
        slot.innerHTML = `<div class="sold-label">${i18n.t('shop_sold')}</div>`;
        container.appendChild(slot);
        continue;
      }

      const effectiveCost = Math.max(1, card.cost - (this._discount || 0));
      const canAfford = effectiveCost <= this._gold;
      const slot = document.createElement('div');
      slot.className = `shop-card-slot${canAfford ? '' : ' unaffordable'}`;
      slot.dataset.rarity = card.rarity;
      card._effectiveCost = effectiveCost;  // 구매 시 사용

      const _isKo = i18n.lang === 'ko';
      const _cName = _isKo ? (card.nameKo || card.name) : card.name;
      const _cDesc = _isKo ? (card.descKo || card.desc) : card.desc;
      const _cType = i18n.t('card_type_' + card.type) ?? card.type;
      slot.innerHTML = `
        <div class="shop-card-inner">
          <div class="shop-card-top">
            <span class="shop-card-icon">${card.icon}</span>
            <div class="shop-card-info">
              <div class="shop-card-name">${_cName}</div>
              <div class="shop-card-type">${_cType.toUpperCase()}</div>
            </div>
            <div class="shop-card-cost ${canAfford ? 'affordable' : ''}">
              ${this._discount > 0 && card.cost > effectiveCost
                ? `<del class="original-price">${card.cost}g</del> `
                : ''}${effectiveCost > 0 ? effectiveCost + 'g' : i18n.t('free')}
            </div>
          </div>
          <div class="shop-card-desc">${_cDesc}</div>
          <div class="shop-rarity-bar"></div>
        </div>
        <button class="btn-buy ${canAfford ? 'can-buy' : ''}" data-uid="${card.uid}">
          ${canAfford ? i18n.t('shop_buy') : i18n.t('shop_cant_afford', effectiveCost)}
        </button>
      `;

      if (canAfford) {
        slot.querySelector('.btn-buy').addEventListener('click', () => this._buy(card));
      }

      container.appendChild(slot);
    }
  }

  _buy(card) {
    const cost = card._effectiveCost ?? card.cost;
    if (cost > this._gold) return;
    this._gold -= cost;
    card._bought = true;
    card.cost = cost;  // onBuy 콜백에서 정확한 비용 사용

    this.onBuy(card);
    this._renderCards();
    this._refreshGold();
    this._refreshRerollBtn();
    const _bName = i18n.lang === 'ko' ? (card.nameKo || card.name) : card.name;
    this.onLog(i18n.t('shop_bought', _bName), 'good');
  }

  _reroll() {
    if (this._rerolls >= MAX_REROLLS) return;
    // Merchant's Ring: 첫 번째 리롤은 무료
    const isFree = this._freeRerolls > 0 && this._rerolls === 0;
    const cost   = isFree ? 0 : REROLL_COST;
    if (this._gold < cost) {
      this.onLog(i18n.t('shop_not_enough_gold'), 'bad');
      return;
    }
    this._gold -= cost;
    this._rerolls++;
    if (cost > 0) this.onBuy({ _rerollCost: cost });  // 유료일 때만 골드 차감 신호
    if (isFree) this.onLog(i18n.t('log_free_reroll'), 'gold');
    this._offer();
    this._refreshGold();
    this._refreshRerollBtn();
    this.onLog(i18n.t('shop_rerolled', MAX_REROLLS - this._rerolls), 'gold');
  }

  _refreshGold() {
    const el = this.container.querySelector('#shop-gold-val');
    if (el) el.textContent = this._gold;
  }

  _refreshRerollBtn() {
    const btn = this.container.querySelector('#shop-reroll');
    const remain = this.container.querySelector('#reroll-remaining');
    const left = MAX_REROLLS - this._rerolls;

    btn.disabled = left <= 0 || this._gold < REROLL_COST;
    if (remain) remain.textContent = left > 0 ? i18n.t('shop_rerolls_left', left) : i18n.t('shop_no_rerolls');
  }

  _refreshCardAffordability() {
    this._renderCards();
  }
}
