import { describe, it, expect, beforeEach } from 'vitest';
import { CardSystem } from '../src/systems/CardSystem.js';

function makeCards(n) {
  return Array.from({ length: n }, (_, i) => ({ uid: `card-${i}`, id: `c${i}` }));
}

describe('CardSystem', () => {
  let cs;

  beforeEach(() => {
    cs = new CardSystem(makeCards(10), 5);
  });

  describe('drawHand()', () => {
    it('draws handSize cards from empty hand', () => {
      cs.drawHand();
      expect(cs.hand.length).toBe(5);
      expect(cs.drawPile.length).toBe(5);
    });

    it('fills only the remaining gap when hand is partially filled', () => {
      cs.drawHand();
      cs.hand.splice(0, 2);
      cs.drawHand();
      expect(cs.hand.length).toBe(5);
    });

    it('respects bonusHandSize', () => {
      cs.bonusHandSize = 2;
      cs.drawHand();
      expect(cs.hand.length).toBe(7);
    });

    it('does not overdraw beyond available cards', () => {
      cs = new CardSystem(makeCards(3), 5);
      cs.drawHand();
      expect(cs.hand.length).toBe(3);
    });
  });

  describe('_reshuffle()', () => {
    it('moves discardPile back into drawPile and clears discard', () => {
      cs.drawHand();
      cs.discardHand();
      cs._reshuffle();
      expect(cs.drawPile.length).toBe(5);
      expect(cs.discardPile.length).toBe(0);
    });

    it('triggers automatically when drawPile exhausts during drawHand', () => {
      cs.drawHand();
      cs.discardHand();
      cs.drawHand();
      cs.discardHand();
      // drawPile is now empty; discardPile has 5 — next drawHand must reshuffle
      cs.drawHand();
      expect(cs.hand.length).toBe(5);
    });
  });

  describe('playCard(uid)', () => {
    it('removes card from hand and adds to discardPile', () => {
      cs.drawHand();
      const uid = cs.hand[0].uid;
      cs.playCard(uid);
      expect(cs.hand.some(c => c.uid === uid)).toBe(false);
      expect(cs.discardPile.some(c => c.uid === uid)).toBe(true);
    });

    it('returns the played card', () => {
      cs.drawHand();
      const uid = cs.hand[1].uid;
      const result = cs.playCard(uid);
      expect(result.uid).toBe(uid);
    });

    it('increments totalPlayed', () => {
      cs.drawHand();
      cs.playCard(cs.hand[0].uid);
      cs.playCard(cs.hand[0].uid);
      expect(cs.totalPlayed).toBe(2);
    });

    it('returns null and does not change totalPlayed when uid not found', () => {
      cs.drawHand();
      const result = cs.playCard('nonexistent');
      expect(result).toBeNull();
      expect(cs.totalPlayed).toBe(0);
    });
  });

  describe('drawExtra(n)', () => {
    it('draws n cards into hand', () => {
      cs.drawExtra(3);
      expect(cs.hand.length).toBe(3);
      expect(cs.drawPile.length).toBe(7);
    });

    it('stops at total available cards when n exceeds deck size', () => {
      cs.drawExtra(20);
      expect(cs.hand.length).toBe(10);
    });

    it('can draw 0 cards without error', () => {
      cs.drawExtra(0);
      expect(cs.hand.length).toBe(0);
    });
  });

  describe('discardHand()', () => {
    it('moves all hand cards to discardPile and empties hand', () => {
      cs.drawHand();
      cs.discardHand();
      expect(cs.hand.length).toBe(0);
      expect(cs.discardPile.length).toBe(5);
    });

    it('is a no-op when hand is already empty', () => {
      cs.discardHand();
      expect(cs.hand.length).toBe(0);
      expect(cs.discardPile.length).toBe(0);
    });
  });

  describe('getters', () => {
    it('deckCount reflects drawPile length', () => {
      expect(cs.deckCount).toBe(10);
      cs.drawHand();
      expect(cs.deckCount).toBe(5);
    });

    it('discardCount reflects discardPile length', () => {
      cs.drawHand();
      cs.discardHand();
      expect(cs.discardCount).toBe(5);
    });

    it('handCount reflects hand length', () => {
      expect(cs.handCount).toBe(0);
      cs.drawHand();
      expect(cs.handCount).toBe(5);
    });
  });
});
