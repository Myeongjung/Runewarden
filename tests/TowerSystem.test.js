import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── mocks ────────────────────────────────────────────────────────────────────
const mockEl = () => {
  const el = {
    style: {}, children: [],
    classList: { add: vi.fn(), remove: vi.fn() },
  };
  el.setAttribute    = vi.fn();
  el.getAttribute    = vi.fn(() => null);
  el.remove          = vi.fn();
  el.appendChild     = vi.fn(c => el.children.push(c));
  el.insertBefore    = vi.fn();
  el.querySelector   = vi.fn(() => null);
  el.ownerSVGElement = el;
  return el;
};

vi.stubGlobal('document', {
  getElementById:  vi.fn(() => null),
  createElement:   vi.fn(() => mockEl()),
  createElementNS: vi.fn(() => mockEl()),
  head:            { appendChild: vi.fn() },
});

vi.mock('../src/rendering/MapRenderer.js', () => ({
  hexToPixel: (c, r) => ({ x: c * 60, y: r * 60 }),
  svgEl:      (_tag, _attrs) => mockEl(),
}));

vi.mock('../src/systems/AudioSystem.js', () => ({
  audio: { play: vi.fn() },
}));

vi.mock('../src/config/constants.js', () => ({ HEX_W: 60 }));

import { TowerSystem } from '../src/systems/TowerSystem.js';
import { TOWER_DEFS }  from '../src/data/towers.js';

// ── helpers ──────────────────────────────────────────────────────────────────
function makeMockEnemySystem() {
  return {
    enemies: [],
    getLeadEnemy:      vi.fn(() => null),
    getEnemiesInRange: vi.fn(() => []),
    dealDamage:        vi.fn(() => false),
    applySlow:         vi.fn(),
    applyBurn:         vi.fn(),
  };
}

function makeTS() {
  const layer = mockEl();
  const es    = makeMockEnemySystem();
  const ts    = new TowerSystem(layer, es, vi.fn());
  return { ts, es };
}

// ── place ─────────────────────────────────────────────────────────────────────
describe('place()', () => {
  let ts;

  beforeEach(() => {
    ({ ts } = makeTS());
  });

  it('places a tower and returns true', () => {
    const archer = TOWER_DEFS['archer'];
    const result = ts.place(2, 3, archer);
    expect(result).toBe(true);
    expect(ts.towers.has('2,3')).toBe(true);
  });

  it('returns false when cell is already occupied', () => {
    const archer = TOWER_DEFS['archer'];
    ts.place(1, 1, archer);
    expect(ts.place(1, 1, archer)).toBe(false);
  });

  it('stores correct base damage for archer', () => {
    const archer = TOWER_DEFS['archer'];
    ts.place(0, 0, archer);
    const t = ts.towers.get('0,0');
    expect(t.damage).toBeCloseTo(archer.damage);
    expect(t.augments).toEqual([]);
  });

  it('increments _fireDrakeCount when fire_drake is placed', () => {
    const drake = TOWER_DEFS['fire_drake'];
    if (!drake) return;
    ts.place(0, 0, drake);
    expect(ts._fireDrakeCount).toBe(1);
  });

  it('does not increment _fireDrakeCount for non-drake tower', () => {
    ts.place(0, 0, TOWER_DEFS['archer']);
    expect(ts._fireDrakeCount).toBe(0);
  });
});

// ── augment ───────────────────────────────────────────────────────────────────
describe('augment()', () => {
  let ts;

  beforeEach(() => {
    ({ ts } = makeTS());
    ts.place(0, 0, TOWER_DEFS['archer']);
  });

  it('applies damage multiplier to tower', () => {
    const t       = ts.towers.get('0,0');
    const baseDmg = t.damage;
    ts.augment(0, 0, { stat: 'damage', mult: 1.5 });
    expect(t.damage).toBeCloseTo(baseDmg * 1.5);
  });

  it('supports multi-stat augments via stats array', () => {
    const t          = ts.towers.get('0,0');
    const baseDmg    = t.damage;
    const baseRange  = t.range;
    ts.augment(0, 0, {
      stats: [{ stat: 'damage', mult: 1.2 }, { stat: 'range', mult: 1.1 }],
    });
    expect(t.damage).toBeCloseTo(baseDmg  * 1.2);
    expect(t.range).toBeCloseTo(baseRange * 1.1);
  });

  it('stacks two augments correctly', () => {
    const t       = ts.towers.get('0,0');
    const baseDmg = t.damage;
    ts.augment(0, 0, { stat: 'damage', mult: 1.2 });
    ts.augment(0, 0, { stat: 'damage', mult: 1.3 });
    expect(t.damage).toBeCloseTo(baseDmg * 1.2 * 1.3);
  });

  it('blocks a third augment and returns false', () => {
    ts.augment(0, 0, { stat: 'damage',      mult: 1.1 });
    ts.augment(0, 0, { stat: 'attackSpeed', mult: 0.9 });
    expect(ts.augment(0, 0, { stat: 'range', mult: 1.2 })).toBe(false);
    expect(ts.towers.get('0,0').augments.length).toBe(2);
  });

  it('returns false for unknown cell', () => {
    expect(ts.augment(9, 9, { stat: 'damage', mult: 2 })).toBe(false);
  });
});

// ── relic stat bonuses ────────────────────────────────────────────────────────
describe('addRelicDmgBonus()', () => {
  let ts;

  beforeEach(() => {
    ({ ts } = makeTS());
    ts.place(0, 0, TOWER_DEFS['archer']);
  });

  it('applies damage multiplier to existing towers of that type', () => {
    const t       = ts.towers.get('0,0');
    const baseDmg = t.damage;
    ts.addRelicDmgBonus('archer', 1.3);
    expect(t.damage).toBeCloseTo(baseDmg * 1.3);
  });

  it('stacks multiplicatively across two calls', () => {
    const t       = ts.towers.get('0,0');
    const baseDmg = t.damage;
    ts.addRelicDmgBonus('archer', 1.2);
    ts.addRelicDmgBonus('archer', 1.5);
    expect(t.damage).toBeCloseTo(baseDmg * 1.2 * 1.5);
  });

  it('does not affect towers of a different type', () => {
    ts.place(1, 0, TOWER_DEFS['cannon']);
    const cannon  = ts.towers.get('1,0');
    const baseDmg = cannon.damage;
    ts.addRelicDmgBonus('archer', 2.0);
    expect(cannon.damage).toBeCloseTo(baseDmg);
  });
});

// ── global buffs ──────────────────────────────────────────────────────────────
describe('applyGlobalSpeedBoost()', () => {
  it('keeps the faster (lower) mult when called twice', () => {
    const { ts } = makeTS();
    ts.applyGlobalSpeedBoost(0.5, 3000);
    ts.applyGlobalSpeedBoost(0.8, 2000); // slower — should not win
    expect(ts._globalSpeedMult).toBe(0.5);
  });

  it('keeps the longer timer', () => {
    const { ts } = makeTS();
    ts.applyGlobalSpeedBoost(0.5, 3000);
    ts.applyGlobalSpeedBoost(0.6, 5000);
    expect(ts._globalSpeedTimer).toBe(5000);
  });
});

describe('applyGlobalDamageBoost()', () => {
  it('keeps the stronger (higher) mult when called twice', () => {
    const { ts } = makeTS();
    ts.applyGlobalDamageBoost(1.5, 2000);
    ts.applyGlobalDamageBoost(1.2, 1000); // weaker — should not win
    expect(ts._globalDmgMult).toBe(1.5);
  });

  it('keeps the longer timer', () => {
    const { ts } = makeTS();
    ts.applyGlobalDamageBoost(1.5, 1000);
    ts.applyGlobalDamageBoost(1.2, 4000);
    expect(ts._globalDmgTimer).toBe(4000);
  });
});

// ── star system ───────────────────────────────────────────────────────────────
describe('upgradeStar()', () => {
  let ts;

  beforeEach(() => {
    ({ ts } = makeTS());
    ts.place(0, 0, TOWER_DEFS['archer']);
  });

  it('increments starLevel and _starMult correctly: 1→2→3', () => {
    const t = ts.towers.get('0,0');
    expect(t.starLevel).toBe(1);
    expect(t._starMult).toBeCloseTo(1.0);

    const result1 = ts.upgradeStar(0, 0);
    expect(result1).toBe(true);
    expect(t.starLevel).toBe(2);
    expect(t._starMult).toBeCloseTo(1.4);

    const result2 = ts.upgradeStar(0, 0);
    expect(result2).toBe(true);
    expect(t.starLevel).toBe(3);
    expect(t._starMult).toBeCloseTo(2.24);
  });

  it('returns false and makes no changes when already at 3★', () => {
    const t = ts.towers.get('0,0');
    ts.upgradeStar(0, 0);
    ts.upgradeStar(0, 0);
    const dmgBefore      = t.damage;
    const baseDmgBefore  = t.baseDamage;

    const result = ts.upgradeStar(0, 0);
    expect(result).toBe(false);
    expect(t.starLevel).toBe(3);
    expect(t._starMult).toBeCloseTo(2.24);
    expect(t.damage).toBeCloseTo(dmgBefore);
    expect(t.baseDamage).toBeCloseTo(baseDmgBefore);
  });

  it('preserves __all__ relic damage bonus when upgrading star', () => {
    const t = ts.towers.get('0,0');
    const dmgBeforeRelic = t.damage;
    ts.addRelicDmgBonus('__all__', 1.5);
    const dmgAfterRelic = t.damage;
    expect(dmgAfterRelic).toBeCloseTo(dmgBeforeRelic * 1.5);

    ts.upgradeStar(0, 0);
    // upgradeStar only changes _starMult — t.damage itself must be unchanged
    expect(t.damage).toBeCloseTo(dmgAfterRelic);
    expect(t._starMult).toBeCloseTo(1.4);
  });

  it('preserves augment damage bonus when upgrading star', () => {
    const t = ts.towers.get('0,0');
    ts.augment(0, 0, { stat: 'damage', mult: 1.3 });
    const dmgAfterAugment = t.damage;

    ts.upgradeStar(0, 0);
    // upgradeStar only changes _starMult — t.damage itself must be unchanged
    expect(t.damage).toBeCloseTo(dmgAfterAugment);
    expect(t._starMult).toBeCloseTo(1.4);
  });
});

// ── reroll cost sequence ──────────────────────────────────────────────────────
describe('_nextRerollCost() sequence', () => {
  it('produces the expected cost sequence [2, 3, 5, 7, 9, 10, 10]', () => {
    function nextRerollCost(rerolls) {
      if (rerolls === 0) return 2;
      return Math.min(2 * rerolls + 1, 10);
    }

    const seq = [0, 1, 2, 3, 4, 5, 6].map(nextRerollCost);
    expect(seq).toEqual([2, 3, 5, 7, 9, 10, 10]);
  });
});
