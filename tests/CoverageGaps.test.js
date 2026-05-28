import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── localStorage mock ────────────────────────────────────────────────────────
const store = {};
vi.stubGlobal('localStorage', {
  getItem:    vi.fn(k => store[k] ?? null),
  setItem:    vi.fn((k, v) => { store[k] = v; }),
  removeItem: vi.fn(k => { delete store[k]; }),
  clear:      vi.fn(() => { for (const k in store) delete store[k]; }),
});

import { CardSystem } from '../src/systems/CardSystem.js';
import { MetaSystem, xpForLevel, calcRunXP, MAX_RANK, CODEX_UNLOCKS } from '../src/systems/MetaSystem.js';
import { resolveSpell } from '../src/core/SpellResolver.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeCards(n) {
  return Array.from({ length: n }, (_, i) => ({ uid: `card-${i}`, id: `c${i}` }));
}

function freshMeta() {
  localStorage.clear();
  return new MetaSystem();
}

function makeCtx(overrides = {}) {
  return {
    addGold:   vi.fn(),
    spendGold: vi.fn(),
    log:       vi.fn(),
    i18n:      { t: (k) => k },
    audio:     { play: vi.fn() },
    enemySystem: {
      enemies:             [],
      freezeAll:           vi.fn(),
      dealDamageToAll:     vi.fn(),
      dealDamageToLead:    vi.fn().mockReturnValue(null),
      dealDamageToRandom:  vi.fn(),
      dealDamage:          vi.fn(),
      slowAll:             vi.fn(),
      teleportToStart:     vi.fn(),
      getEnemiesInRange:   vi.fn().mockReturnValue([]),
      pushBack:            vi.fn(),
      applySlow:           vi.fn(),
      applySolarDotAll:    vi.fn(),
    },
    towerSystem: {
      towers:                new Map(),
      applyGlobalSpeedBoost: vi.fn(),
      applyGlobalDamageBoost:vi.fn(),
      triggerAllTeslas:      vi.fn().mockReturnValue(0),
      triggerAllByTag:       vi.fn().mockReturnValue(0),
    },
    cardSystem: {
      hand:        [],
      discardPile: [],
      drawExtra:   vi.fn(),
      discardHand: vi.fn(),
    },
    state:          {},
    hasRelic:       vi.fn().mockReturnValue(false),
    renderHand:     vi.fn(),
    applyNexusHeal: vi.fn(),
    ...overrides,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// CardSystem
// ════════════════════════════════════════════════════════════════════════════

describe('CardSystem — _reshuffle', () => {
  it('moves exact card objects from discardPile back into drawPile', () => {
    const cs = new CardSystem(makeCards(3), 3);
    cs.drawHand();
    cs.discardHand();
    cs._reshuffle();
    expect(cs.drawPile.length).toBe(3);
    expect(cs.discardPile.length).toBe(0);
    const uids = cs.drawPile.map(c => c.uid).sort();
    expect(uids).toEqual(['card-0', 'card-1', 'card-2'].sort());
  });
});

describe('CardSystem — drawExtra reshuffle mid-draw', () => {
  it('completes drawing across a reshuffle boundary', () => {
    const cs = new CardSystem(makeCards(4), 2);
    cs.drawHand();      // hand 2, drawPile 2
    cs.discardHand();   // discardPile 2, drawPile 2
    cs.drawExtra(2);    // drawPile 0, discardPile 2
    cs.discardHand();   // discardPile 4, drawPile 0
    cs.drawExtra(3);    // must reshuffle to draw 3
    expect(cs.hand.length).toBe(3);
  });
});

describe('CardSystem — bonusHandSize edge cases', () => {
  it('treats null bonusHandSize as 0', () => {
    const cs = new CardSystem(makeCards(10), 5);
    cs.bonusHandSize = null;
    cs.drawHand();
    expect(cs.hand.length).toBe(5);
  });

  it('reduces draw when bonusHandSize is negative', () => {
    const cs = new CardSystem(makeCards(10), 5);
    cs.bonusHandSize = -1;
    cs.drawHand();
    expect(cs.hand.length).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// calcRunXP
// ════════════════════════════════════════════════════════════════════════════

describe('calcRunXP', () => {
  it('returns 0 for all-zero inputs', () => {
    expect(calcRunXP({ wavesCleared: 0, enemiesKilled: 0, nexusHpLeft: 0, victory: false })).toBe(0);
  });

  it('adds exactly 50 XP for victory', () => {
    const win  = calcRunXP({ wavesCleared: 0, enemiesKilled: 0, nexusHpLeft: 0, victory: true });
    const lose = calcRunXP({ wavesCleared: 0, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    expect(win - lose).toBe(50);
  });

  it('counts each wave as 15 XP', () => {
    expect(calcRunXP({ wavesCleared: 4, enemiesKilled: 0, nexusHpLeft: 0, victory: false })).toBe(60);
  });

  it('counts each nexus HP left as 8 XP', () => {
    expect(calcRunXP({ wavesCleared: 0, enemiesKilled: 0, nexusHpLeft: 3, victory: false })).toBe(24);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// MetaSystem — getters and methods
// ════════════════════════════════════════════════════════════════════════════

describe('MetaSystem — rankProgress', () => {
  it('returns 0 at rank 0 with 0 XP', () => {
    const meta = freshMeta();
    expect(meta.rankProgress).toBe(0);
  });

  it('returns between 0 and 1 when partially through a rank', () => {
    const meta = freshMeta();
    meta._data.totalXP = Math.floor(xpForLevel(1) / 2);
    expect(meta.rankProgress).toBeGreaterThan(0);
    expect(meta.rankProgress).toBeLessThan(1);
  });

  it('returns 1 at MAX_RANK', () => {
    const meta = freshMeta();
    meta._data.rank    = MAX_RANK;
    meta._data.totalXP = xpForLevel(MAX_RANK) + 9999;
    expect(meta.rankProgress).toBe(1);
  });
});

describe('MetaSystem — xpToNextRank', () => {
  it('equals xpForLevel(1) at rank 0', () => {
    const meta = freshMeta();
    expect(meta.xpToNextRank).toBe(xpForLevel(1));
  });

  it('decreases as totalXP increases', () => {
    const meta   = freshMeta();
    const before = meta.xpToNextRank;
    meta._data.totalXP = 50;
    expect(meta.xpToNextRank).toBe(before - 50);
  });

  it('returns 0 at MAX_RANK', () => {
    const meta = freshMeta();
    meta._data.rank    = MAX_RANK;
    meta._data.totalXP = xpForLevel(MAX_RANK);
    expect(meta.xpToNextRank).toBe(0);
  });
});

describe('MetaSystem — _validate', () => {
  it('rejects data with negative rank', () => {
    const meta = freshMeta();
    expect(meta._validate({ totalXP: 0, rank: -1, unlockedCards: [], bonuses: {} })).toBe(false);
  });

  it('rejects data with negative totalXP', () => {
    const meta = freshMeta();
    expect(meta._validate({ totalXP: -1, rank: 0, unlockedCards: [], bonuses: {} })).toBe(false);
  });
});

describe('MetaSystem — totalKills accumulates', () => {
  it('sums kills from multiple runs', () => {
    const meta = freshMeta();
    meta.applyRunResult({ wavesCleared: 1, enemiesKilled: 30, nexusHpLeft: 0, victory: false });
    meta.applyRunResult({ wavesCleared: 1, enemiesKilled: 20, nexusHpLeft: 0, victory: false });
    expect(meta.totalKills).toBe(50);
  });
});

describe('MetaSystem — multi-rank-up in one applyRunResult', () => {
  it('grants all unlocks when XP crosses multiple rank thresholds', () => {
    const meta   = freshMeta();
    const needed = xpForLevel(3);  // 80*3 + 20*9 = 420
    meta._data.totalXP = needed - 1;
    const { newUnlocks } = meta.applyRunResult({ wavesCleared: 1, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    const rank3 = CODEX_UNLOCKS.find(u => u.rank === 3);
    if (rank3) expect(newUnlocks.map(u => u.title)).toContain(rank3.title);
    expect(meta.rank).toBeGreaterThanOrEqual(3);
  });
});

describe('MetaSystem — _applyUnlock', () => {
  it('adds new cards to unlockedCards', () => {
    const meta = freshMeta();
    meta._applyUnlock({ type: 'cards', cards: ['test_card_xyz'] });
    expect(meta.unlockedCards).toContain('test_card_xyz');
  });

  it('does not duplicate cards already unlocked', () => {
    const meta   = freshMeta();
    const before = meta._data.unlockedCards.filter(c => c === 'summon_archer').length;
    meta._applyUnlock({ type: 'cards', cards: ['summon_archer'] });
    expect(meta._data.unlockedCards.filter(c => c === 'summon_archer').length).toBe(before);
  });

  it('accumulates bonus startGold from multiple unlocks', () => {
    const meta = freshMeta();
    meta._applyUnlock({ type: 'bonus', bonus: { startGold: 5 } });
    meta._applyUnlock({ type: 'bonus', bonus: { startGold: 3 } });
    expect(meta.bonuses.startGold).toBe(8);
  });

  it('pushes badge title into badges array', () => {
    const meta = freshMeta();
    meta._applyUnlock({ type: 'badge', title: 'Test Badge' });
    expect(meta._data.badges).toContain('Test Badge');
  });
});

describe('MetaSystem — recordRun', () => {
  it('prepends entry so newest is first', () => {
    const meta = freshMeta();
    meta.recordRun({ wave: 1 });
    meta.recordRun({ wave: 2 });
    expect(meta.runHistory[0].wave).toBe(2);
  });

  it('caps history at 5 entries', () => {
    const meta = freshMeta();
    for (let i = 0; i < 7; i++) meta.recordRun({ wave: i });
    expect(meta.runHistory.length).toBe(5);
    expect(meta.runHistory[0].wave).toBe(6);
  });

  it('handles undefined runHistory gracefully', () => {
    const meta = freshMeta();
    meta._data.runHistory = undefined;
    expect(() => meta.recordRun({ wave: 1 })).not.toThrow();
    expect(meta.runHistory.length).toBe(1);
  });
});

describe('MetaSystem — clearAscension', () => {
  it('returns true and stores new high', () => {
    const meta = freshMeta();
    expect(meta.clearAscension(1)).toBe(true);
    expect(meta.maxAscensionCleared).toBe(1);
  });

  it('returns false for repeated or lower level', () => {
    const meta = freshMeta();
    meta.clearAscension(2);
    expect(meta.clearAscension(2)).toBe(false);
    expect(meta.clearAscension(1)).toBe(false);
    expect(meta.maxAscensionCleared).toBe(2);
  });
});

describe('MetaSystem — maxSelectableAscension', () => {
  it('returns 0 below MAX_RANK', () => {
    const meta = freshMeta();
    meta._data.rank = MAX_RANK - 1;
    expect(meta.maxSelectableAscension).toBe(0);
  });

  it('returns 1 at MAX_RANK with 0 cleared', () => {
    const meta = freshMeta();
    meta._data.rank = MAX_RANK;
    meta._data.maxAscensionCleared = 0;
    expect(meta.maxSelectableAscension).toBe(1);
  });

  it('caps at 3 even with high cleared count', () => {
    const meta = freshMeta();
    meta._data.rank = MAX_RANK;
    meta._data.maxAscensionCleared = 99;
    expect(meta.maxSelectableAscension).toBe(3);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// SpellResolver — uncovered spell types
// ════════════════════════════════════════════════════════════════════════════

describe('resolveSpell — chain_damage', () => {
  it('damages lead and chains to nearby enemies (respecting chainCount)', () => {
    const ctx    = makeCtx();
    const lead   = { id: 'lead', x: 0, y: 0 };
    const nearby = [{ id: 'n1' }, { id: 'n2' }, { id: 'n3' }];
    ctx.enemySystem.dealDamageToLead   = vi.fn().mockReturnValue(lead);
    ctx.enemySystem.getEnemiesInRange  = vi.fn().mockReturnValue([lead, ...nearby]);
    resolveSpell({ type: 'chain_damage', damage: 50, chainDmg: 25, chainCount: 2 }, ctx);
    expect(ctx.enemySystem.dealDamageToLead).toHaveBeenCalledWith(50);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledTimes(2);  // chainCount=2
  });

  it('logs miss and skips chain when no lead exists', () => {
    const ctx = makeCtx();
    ctx.enemySystem.dealDamageToLead = vi.fn().mockReturnValue(null);
    resolveSpell({ type: 'chain_damage', damage: 50, chainDmg: 20, chainCount: 3 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_chain_bolt_miss', '');
    expect(ctx.enemySystem.dealDamage).not.toHaveBeenCalled();
  });
});

describe('resolveSpell — nova', () => {
  it('deals damage and slows all enemies', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'nova', damage: 30, slowAmt: 0.5, slowDuration: 2000 }, ctx);
    expect(ctx.enemySystem.dealDamageToAll).toHaveBeenCalledWith(30);
    expect(ctx.enemySystem.slowAll).toHaveBeenCalledWith(0.5, 2000);
  });

  it('logs ice_storm for damage <= 20', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'nova', damage: 15, slowAmt: 0.3, slowDuration: 1500 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_ice_storm', 'good');
  });

  it('logs ember_rain for damage 21–45', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'nova', damage: 35, slowAmt: 0.3, slowDuration: 1500 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_ember_rain', 'good');
  });

  it('logs nova for damage > 45', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'nova', damage: 60, slowAmt: 0.3, slowDuration: 1500 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_nova', 'good');
  });
});

describe('resolveSpell — damage_all', () => {
  it('calls dealDamageToAll', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'damage_all', amount: 40 }, ctx);
    expect(ctx.enemySystem.dealDamageToAll).toHaveBeenCalledWith(40);
  });

  it('logs crimson_tide for amount >= 70', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'damage_all', amount: 80 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_crimson_tide', 'good');
  });

  it('logs damage_all for amount < 70', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'damage_all', amount: 30 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_damage_all', 'good');
  });
});

describe('resolveSpell — nature_cycle', () => {
  it('discards hand and draws 5 new cards', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'nature_cycle' }, ctx);
    expect(ctx.cardSystem.discardHand).toHaveBeenCalled();
    expect(ctx.cardSystem.drawExtra).toHaveBeenCalledWith(5);
    expect(ctx.renderHand).toHaveBeenCalled();
  });
});

describe('resolveSpell — recall_discard', () => {
  it('moves cards from discardPile to hand', () => {
    const ctx   = makeCtx();
    const cardA = { uid: 'a' };
    const cardB = { uid: 'b' };
    ctx.cardSystem.discardPile = [cardA, cardB];
    resolveSpell({ type: 'recall_discard', count: 2 }, ctx);
    expect(ctx.cardSystem.hand).toContain(cardA);
    expect(ctx.cardSystem.hand).toContain(cardB);
    expect(ctx.renderHand).toHaveBeenCalled();
  });

  it('recalls only up to available count', () => {
    const ctx = makeCtx();
    ctx.cardSystem.discardPile = [{ uid: 'x' }];
    resolveSpell({ type: 'recall_discard', count: 5 }, ctx);
    expect(ctx.cardSystem.hand.length).toBe(1);
  });

  it('logs no_discard when pile is empty', () => {
    const ctx = makeCtx();
    ctx.cardSystem.discardPile = [];
    resolveSpell({ type: 'recall_discard', count: 2 }, ctx);
    expect(ctx.renderHand).not.toHaveBeenCalled();
    expect(ctx.log).toHaveBeenCalledWith('spell_no_discard', '');
  });
});

describe('resolveSpell — percent_hp_damage', () => {
  it('deals percentage of current HP to each enemy', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [{ id: 'e1', hp: 100 }, { id: 'e2', hp: 200 }];
    resolveSpell({ type: 'percent_hp_damage', percent: 0.25 }, ctx);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e1', 25);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e2', 50);
  });

  it('deals minimum 1 damage', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [{ id: 'e1', hp: 1 }];
    resolveSpell({ type: 'percent_hp_damage', percent: 0.001 }, ctx);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e1', 1);
  });

  it('is a no-op when there are no enemies', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [];
    resolveSpell({ type: 'percent_hp_damage', percent: 0.5 }, ctx);
    expect(ctx.enemySystem.dealDamage).not.toHaveBeenCalled();
  });
});

describe('resolveSpell — shadow_nova', () => {
  it('deals missing-HP-based damage, minimum 1', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [
      { id: 'e1', hp: 60,  maxHp: 100 },  // missing=40 → ceil(40*0.5)=20
      { id: 'e2', hp: 100, maxHp: 100 },  // missing=0  → max(1,0)=1
    ];
    resolveSpell({ type: 'shadow_nova', pct: 0.5 }, ctx);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e1', 20);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e2', 1);
  });
});

describe('resolveSpell — soul_feast', () => {
  it('executes low-HP enemies and awards gold per kill', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [
      { id: 'e1', hp: 20,  maxHp: 100 },  // 20% → below 25%
      { id: 'e2', hp: 80,  maxHp: 100 },  // 80% → above 25%
      { id: 'e3', hp: 10,  maxHp: 100 },  // 10% → below 25%
    ];
    resolveSpell({ type: 'soul_feast', hpThreshold: 0.25, goldPerKill: 3 }, ctx);
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e1', expect.any(Number));
    expect(ctx.enemySystem.dealDamage).toHaveBeenCalledWith('e3', expect.any(Number));
    expect(ctx.enemySystem.dealDamage).not.toHaveBeenCalledWith('e2', expect.any(Number));
    expect(ctx.addGold).toHaveBeenCalledWith(6, null, true);  // 2 kills × 3g
  });

  it('does not call addGold when no enemies below threshold', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [{ id: 'e1', hp: 90, maxHp: 100 }];
    resolveSpell({ type: 'soul_feast', hpThreshold: 0.25, goldPerKill: 3 }, ctx);
    expect(ctx.addGold).not.toHaveBeenCalled();
  });
});

describe('resolveSpell — damage_lead (null lead)', () => {
  it('does not call applySlow when lead is null', () => {
    const ctx = makeCtx();
    ctx.enemySystem.dealDamageToLead = vi.fn().mockReturnValue(null);
    resolveSpell({ type: 'damage_lead', amount: 25, slow: 0.4, slowDur: 3000 }, ctx);
    expect(ctx.enemySystem.applySlow).not.toHaveBeenCalled();
  });

  it('does not throw when lead is null', () => {
    const ctx = makeCtx();
    ctx.enemySystem.dealDamageToLead = vi.fn().mockReturnValue(null);
    expect(() => resolveSpell({ type: 'damage_lead', amount: 90 }, ctx)).not.toThrow();
  });
});

// Documents the merged behavior after fixing the duplicate gold_per_enemy handler
describe('resolveSpell — gold_per_enemy (merged handler)', () => {
  it('uses soul_harvest log key when no mult field is present', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [{ id: 1 }, { id: 2 }];
    resolveSpell({ type: 'gold_per_enemy' }, ctx);
    expect(ctx.addGold).toHaveBeenCalledWith(2, null);
    expect(ctx.log).toHaveBeenCalledWith('spell_soul_harvest', 'gold');
  });

  it('uses gold_tithe log key and applies mult when mult field is present', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [{ id: 1 }, { id: 2 }, { id: 3 }];
    resolveSpell({ type: 'gold_per_enemy', mult: 3 }, ctx);
    expect(ctx.addGold).toHaveBeenCalledWith(9, null);
    expect(ctx.log).toHaveBeenCalledWith('spell_gold_tithe', 'gold');
  });

  it('logs no_enemies and skips addGold when enemy list is empty', () => {
    const ctx = makeCtx();
    ctx.enemySystem.enemies = [];
    resolveSpell({ type: 'gold_per_enemy' }, ctx);
    expect(ctx.addGold).not.toHaveBeenCalled();
    expect(ctx.log).toHaveBeenCalledWith('spell_no_enemies', '');
  });
});

describe('resolveSpell — slow_all log branching', () => {
  it('logs spell_decay when label is decay', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'slow_all', amount: 0.3, duration: 2000, label: 'decay' }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_decay', 'good');
  });

  it('logs spell_mass_slow when amount >= 0.65', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'slow_all', amount: 0.70, duration: 2000 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_mass_slow', 'good');
  });

  it('logs spell_slow_all when amount < 0.65', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'slow_all', amount: 0.40, duration: 2000 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_slow_all', 'good');
  });
});

describe('resolveSpell — discard_for_gold', () => {
  it('discards hand and awards goldPerCard for each card', () => {
    const ctx = makeCtx();
    ctx.cardSystem.hand = [{ uid: 'a' }, { uid: 'b' }, { uid: 'c' }];
    resolveSpell({ type: 'discard_for_gold', goldPerCard: 4 }, ctx);
    expect(ctx.cardSystem.discardHand).toHaveBeenCalled();
    expect(ctx.addGold).toHaveBeenCalledWith(12, null);
  });

  it('does not call addGold when hand is empty', () => {
    const ctx = makeCtx();
    ctx.cardSystem.hand = [];
    resolveSpell({ type: 'discard_for_gold', goldPerCard: 4 }, ctx);
    expect(ctx.addGold).not.toHaveBeenCalled();
  });
});

describe('resolveSpell — gold_draw', () => {
  it('grants gold and draws cards', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'gold_draw', amount: 5, draw: 2 }, ctx);
    expect(ctx.addGold).toHaveBeenCalledWith(5, null);
    expect(ctx.cardSystem.drawExtra).toHaveBeenCalledWith(2);
    expect(ctx.renderHand).toHaveBeenCalled();
  });

  it('logs life_tap when draw >= 2', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'gold_draw', amount: 5, draw: 3 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_life_tap', 'gold');
  });

  it('logs gold_draw when draw is 1', () => {
    const ctx = makeCtx();
    resolveSpell({ type: 'gold_draw', amount: 5, draw: 1 }, ctx);
    expect(ctx.log).toHaveBeenCalledWith('spell_gold_draw', 'gold');
  });
});

describe('resolveSpell — void_echo_relic post-processing', () => {
  it('triggers Void tag towers when relic is held and cooldown elapsed', () => {
    const ctx = makeCtx({
      hasRelic:       vi.fn(id => id === 'void_echo_relic'),
      towerSystem:    { towers: new Map(), triggerAllTeslas: vi.fn().mockReturnValue(0), triggerAllByTag: vi.fn().mockReturnValue(2), applyGlobalSpeedBoost: vi.fn(), applyGlobalDamageBoost: vi.fn() },
      enemySystem:    { enemies: [{ id: 'e1' }], dealDamageToAll: vi.fn(), slowAll: vi.fn(), dealDamageToLead: vi.fn().mockReturnValue(null), dealDamageToRandom: vi.fn(), dealDamage: vi.fn(), freezeAll: vi.fn(), teleportToStart: vi.fn(), getEnemiesInRange: vi.fn().mockReturnValue([]), pushBack: vi.fn(), applySlow: vi.fn(), applySolarDotAll: vi.fn() },
      state:          { relics: [{ id: 'void_echo_relic', effect: { cooldownMs: 8000 } }] },
    });
    resolveSpell({ type: 'gold', amount: 1 }, ctx);
    expect(ctx.towerSystem.triggerAllByTag).toHaveBeenCalledWith('Void');
  });

  it('does not trigger within cooldown window', () => {
    const ctx = makeCtx({
      hasRelic:    vi.fn(id => id === 'void_echo_relic'),
      towerSystem: { towers: new Map(), triggerAllTeslas: vi.fn().mockReturnValue(0), triggerAllByTag: vi.fn().mockReturnValue(2), applyGlobalSpeedBoost: vi.fn(), applyGlobalDamageBoost: vi.fn() },
      enemySystem: { enemies: [{ id: 'e1' }], dealDamageToAll: vi.fn(), slowAll: vi.fn(), dealDamageToLead: vi.fn().mockReturnValue(null), dealDamageToRandom: vi.fn(), dealDamage: vi.fn(), freezeAll: vi.fn(), teleportToStart: vi.fn(), getEnemiesInRange: vi.fn().mockReturnValue([]), pushBack: vi.fn(), applySlow: vi.fn(), applySolarDotAll: vi.fn() },
      state:       { relics: [{ id: 'void_echo_relic', effect: { cooldownMs: 8000 } }], _voidEchoLastFired: Date.now() },
    });
    resolveSpell({ type: 'gold', amount: 1 }, ctx);
    expect(ctx.towerSystem.triggerAllByTag).not.toHaveBeenCalled();
  });

  it('does not trigger for _isAutocast spells', () => {
    const ctx = makeCtx({
      hasRelic:    vi.fn(id => id === 'void_echo_relic'),
      towerSystem: { towers: new Map(), triggerAllTeslas: vi.fn().mockReturnValue(0), triggerAllByTag: vi.fn().mockReturnValue(2), applyGlobalSpeedBoost: vi.fn(), applyGlobalDamageBoost: vi.fn() },
      enemySystem: { enemies: [{ id: 'e1' }], dealDamageToAll: vi.fn(), slowAll: vi.fn(), dealDamageToLead: vi.fn().mockReturnValue(null), dealDamageToRandom: vi.fn(), dealDamage: vi.fn(), freezeAll: vi.fn(), teleportToStart: vi.fn(), getEnemiesInRange: vi.fn().mockReturnValue([]), pushBack: vi.fn(), applySlow: vi.fn(), applySolarDotAll: vi.fn() },
      state:       { relics: [{ id: 'void_echo_relic', effect: { cooldownMs: 8000 } }] },
    });
    resolveSpell({ type: 'gold', amount: 1, _isAutocast: true }, ctx);
    expect(ctx.towerSystem.triggerAllByTag).not.toHaveBeenCalled();
  });
});
