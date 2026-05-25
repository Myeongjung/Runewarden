import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── localStorage mock ─────────────────────────────────────────────────────────
const store = {};
vi.stubGlobal('localStorage', {
  getItem:    vi.fn(k => store[k] ?? null),
  setItem:    vi.fn((k, v) => { store[k] = v; }),
  removeItem: vi.fn(k => { delete store[k]; }),
  clear:      vi.fn(() => { for (const k in store) delete store[k]; }),
});

import { MetaSystem, xpForLevel, calcRunXP, MAX_RANK } from '../src/systems/MetaSystem.js';

function freshMeta() {
  localStorage.clear();
  return new MetaSystem();
}

// ── xpForLevel ────────────────────────────────────────────────────────────────
describe('xpForLevel()', () => {
  it('returns 0 for level 0', () => expect(xpForLevel(0)).toBe(0));
  it('returns positive for level 1', () => expect(xpForLevel(1)).toBeGreaterThan(0));
  it('is strictly increasing', () => {
    for (let n = 1; n < MAX_RANK; n++) {
      expect(xpForLevel(n + 1)).toBeGreaterThan(xpForLevel(n));
    }
  });
});

// ── calcRunXP ─────────────────────────────────────────────────────────────────
describe('calcRunXP()', () => {
  it('gives more XP for a victory', () => {
    const win  = calcRunXP({ wavesCleared: 15, enemiesKilled: 100, nexusHpLeft: 2, victory: true });
    const lose = calcRunXP({ wavesCleared: 15, enemiesKilled: 100, nexusHpLeft: 2, victory: false });
    expect(win).toBeGreaterThan(lose);
  });

  it('gives more XP for more waves cleared', () => {
    const more = calcRunXP({ wavesCleared: 10, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    const less = calcRunXP({ wavesCleared:  5, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    expect(more).toBeGreaterThan(less);
  });
});

// ── default state ─────────────────────────────────────────────────────────────
describe('MetaSystem — default state', () => {
  let meta;
  beforeEach(() => { meta = freshMeta(); });

  it('starts at rank 0 with 0 XP', () => {
    expect(meta.rank).toBe(0);
    expect(meta.totalXP).toBe(0);
  });

  it('has unlocked starter cards', () => {
    expect(meta.unlockedCards).toContain('summon_archer');
    expect(meta.unlockedCards).toContain('aug_sharpen');
    expect(meta.unlockedCards).toContain('spell_gold');
  });

  it('starts with zero bonuses', () => {
    expect(meta.bonuses.startGold).toBe(0);
    expect(meta.bonuses.handSize).toBe(0);
    expect(meta.bonuses.nexusHp).toBe(0);
  });
});

// ── applyRunResult / rank up ──────────────────────────────────────────────────
describe('applyRunResult()', () => {
  let meta;
  beforeEach(() => { meta = freshMeta(); });

  it('increases totalXP', () => {
    meta.applyRunResult({ wavesCleared: 5, enemiesKilled: 20, nexusHpLeft: 3, victory: false });
    expect(meta.totalXP).toBeGreaterThan(0);
  });

  it('increments runsPlayed', () => {
    meta.applyRunResult({ wavesCleared: 1, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    expect(meta.runsPlayed).toBe(1);
  });

  it('increments runsWon only on victory', () => {
    meta.applyRunResult({ wavesCleared: 5, enemiesKilled: 10, nexusHpLeft: 2, victory: true });
    expect(meta.runsWon).toBe(1);
    meta.applyRunResult({ wavesCleared: 3, enemiesKilled: 5, nexusHpLeft: 0, victory: false });
    expect(meta.runsWon).toBe(1);
  });

  it('ranks up when XP threshold is crossed', () => {
    // Force enough XP to reach rank 1
    const needed = xpForLevel(1);
    meta._data.totalXP = needed - 1;
    meta.applyRunResult({ wavesCleared: 1, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    // XP gained from 1 wave + 0 kills should push over threshold
    if (meta.totalXP >= xpForLevel(1)) {
      expect(meta.rank).toBeGreaterThanOrEqual(1);
    }
  });

  it('applies xpMultiplier', () => {
    const r = { wavesCleared: 5, enemiesKilled: 20, nexusHpLeft: 1, victory: false };
    const { xpGained: base } = meta.applyRunResult(r, 1);
    meta.reset();
    const { xpGained: doubled } = meta.applyRunResult(r, 2);
    expect(doubled).toBe(base * 2);
  });

  it('returns newUnlocks array', () => {
    const { newUnlocks } = meta.applyRunResult({ wavesCleared: 0, enemiesKilled: 0, nexusHpLeft: 0, victory: false });
    expect(Array.isArray(newUnlocks)).toBe(true);
  });
});

// ── save integrity — _validate ────────────────────────────────────────────────
describe('save integrity — _validate()', () => {
  let meta;
  beforeEach(() => { meta = freshMeta(); });

  it('accepts valid data', () => {
    const valid = { totalXP: 0, rank: 0, unlockedCards: [], bonuses: {} };
    expect(meta._validate(valid)).toBe(true);
  });

  it('rejects null', () => {
    expect(meta._validate(null)).toBe(false);
  });

  it('rejects negative totalXP', () => {
    expect(meta._validate({ totalXP: -1, rank: 0, unlockedCards: [], bonuses: {} })).toBe(false);
  });

  it('rejects missing unlockedCards', () => {
    expect(meta._validate({ totalXP: 0, rank: 0, bonuses: {} })).toBe(false);
  });

  it('rejects non-array unlockedCards', () => {
    expect(meta._validate({ totalXP: 0, rank: 0, unlockedCards: 'bad', bonuses: {} })).toBe(false);
  });

  it('rejects missing bonuses', () => {
    expect(meta._validate({ totalXP: 0, rank: 0, unlockedCards: [] })).toBe(false);
  });
});

// ── corruption recovery ───────────────────────────────────────────────────────
describe('corruption recovery', () => {
  it('falls back to defaults on corrupted JSON', () => {
    localStorage.setItem('runewarden_meta_v1', 'NOT_JSON{{{');
    const meta = new MetaSystem();
    expect(meta.rank).toBe(0);
    expect(meta.totalXP).toBe(0);
  });

  it('falls back to defaults when required fields are missing', () => {
    localStorage.setItem('runewarden_meta_v1', JSON.stringify({ totalXP: 500 }));
    const meta = new MetaSystem();
    expect(meta.rank).toBe(0); // reset to default, not corrupted
  });

  it('migrates old save missing runHistory without resetting progress', () => {
    const oldSave = { totalXP: 800, rank: 5, unlockedCards: ['summon_archer'], bonuses: { startGold: 5 } };
    localStorage.setItem('runewarden_meta_v1', JSON.stringify(oldSave));
    const meta = new MetaSystem();
    expect(meta.totalXP).toBe(800);
    expect(meta.rank).toBe(5);
    expect(Array.isArray(meta.runHistory)).toBe(true);
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────
describe('reset()', () => {
  it('clears all progress back to defaults', () => {
    const meta = freshMeta();
    meta._data.totalXP = 9999;
    meta._data.rank    = 10;
    meta.reset();
    expect(meta.totalXP).toBe(0);
    expect(meta.rank).toBe(0);
  });
});
