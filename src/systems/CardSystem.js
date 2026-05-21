// 카드 덱·핸드·플레이·버림 시스템

export class CardSystem {
  constructor(deckDefs, handSize = 5) {
    this.drawPile     = shuffle([...deckDefs]);
    this.hand         = [];
    this.discardPile  = [];
    this.handSize     = handSize;
    this.bonusHandSize = 0;   // 유물·메타 보너스 드로우 수
    this.totalPlayed  = 0;
  }

  // ── 드로우 ────────────────────────────────────────────
  drawHand() {
    const needed = (this.handSize + (this.bonusHandSize ?? 0)) - this.hand.length;
    for (let i = 0; i < needed; i++) {
      if (this.drawPile.length === 0) this._reshuffle();
      if (this.drawPile.length === 0) break;
      this.hand.push(this.drawPile.pop());
    }
  }

  _reshuffle() {
    this.drawPile = shuffle([...this.discardPile]);
    this.discardPile = [];
  }

  // ── 카드 플레이 ───────────────────────────────────────
  playCard(uid) {
    const idx = this.hand.findIndex(c => c.uid === uid);
    if (idx === -1) return null;
    const [card] = this.hand.splice(idx, 1);
    this.discardPile.push(card);
    this.totalPlayed++;
    return card;
  }

  // ── 추가 드로우 (Mana Surge 등) ──────────────────────
  drawExtra(n) {
    for (let i = 0; i < n; i++) {
      if (this.drawPile.length === 0) this._reshuffle();
      if (this.drawPile.length === 0) break;
      this.hand.push(this.drawPile.pop());
    }
  }

  // ── 웨이브 종료: 남은 핸드 버림 ──────────────────────
  discardHand() {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }

  get deckCount()    { return this.drawPile.length; }
  get discardCount() { return this.discardPile.length; }
  get handCount()    { return this.hand.length; }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
