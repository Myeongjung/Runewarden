import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── DOM / module mocks ──────────────────────────────────────────────────────
const mockEl = () => {
  const el = {
    style: {}, children: [],
    classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
  };
  el.setAttribute    = vi.fn();
  el.getAttribute    = vi.fn(() => null);
  el.remove          = vi.fn();
  el.appendChild     = vi.fn(c => el.children.push(c));
  el.ownerSVGElement = el;
  el.querySelector   = vi.fn(() => null);
  el.insertBefore    = vi.fn();
  return el;
};

vi.stubGlobal('document', {
  getElementById:   vi.fn(() => null),
  createElement:    vi.fn(() => mockEl()),
  createElementNS:  vi.fn(() => mockEl()),
  head:             { appendChild: vi.fn() },
});

vi.mock('../src/rendering/MapRenderer.js', () => ({
  ENEMY_PATH: { current: [[0, 0], [1, 0], [2, 0]] },
  hexToPixel:  (c, r) => ({ x: c * 60, y: r * 60 }),
  svgEl:       (_tag, _attrs) => mockEl(),
}));

vi.mock('../src/systems/AudioSystem.js', () => ({
  audio: { play: vi.fn() },
}));

vi.mock('../src/config/constants.js', () => ({ HEX_W: 60 }));

import { EnemySystem } from '../src/systems/EnemySystem.js';

// ── helpers ─────────────────────────────────────────────────────────────────
function makeEnemy(overrides = {}) {
  return {
    id: 'e1', type: 'grunt', name: 'Grunt',
    x: 60, y: 0, hp: 100, maxHp: 100,
    speed: 50, baseSpeed: 50,
    color: '#888', size: 10, reward: 1,
    isBoss: false, isElite: false,
    shieldHits: 0, slowImmune: false,
    enrageThreshold: null, enraged: false,
    regenDps: 0, damageReduction: 0,
    phase2: false,
    frozen: 0, slowTimer: 0, slowAmt: 0,
    ironShieldCd: 0, ironShielding: 0,
    burns: [],
    el: null, hpBar: null, bodyEl: null, shieldEl: null,
    waypointIndex: 1, reached: false,
    ...overrides,
  };
}

function makeES(overrides = {}) {
  const es = new EnemySystem(mockEl(), vi.fn(), vi.fn(), vi.fn());
  Object.assign(es, overrides);
  return es;
}

// ── _applyVeteranRegen ───────────────────────────────────────────────────────
describe('_applyVeteranRegen()', () => {
  it('returns baseDps unchanged on standard difficulty', () => {
    const es = makeES();
    expect(es._applyVeteranRegen('necromancer', 6)).toBe(6);
  });

  it('applies veteran table overrides when _veteranRegen=true', () => {
    const es = makeES({ _veteranRegen: true });
    expect(es._applyVeteranRegen('necromancer', 6)).toBe(10);
    expect(es._applyVeteranRegen('void_reaper', 8)).toBe(14);
    expect(es._applyVeteranRegen('void_herald', 5)).toBe(8);
  });

  it('falls back to baseDps for unknown type on veteran', () => {
    const es = makeES({ _veteranRegen: true });
    expect(es._applyVeteranRegen('grunt', 4)).toBe(4);
  });

  it('halves DPS when _noviceRegen=true', () => {
    const es = makeES({ _noviceRegen: true });
    expect(es._applyVeteranRegen('necromancer', 6)).toBe(3);
    expect(es._applyVeteranRegen('void_reaper', 8)).toBe(4);
  });

  it('returns minimum 1 for novice regen on low base', () => {
    const es = makeES({ _noviceRegen: true });
    expect(es._applyVeteranRegen('necromancer', 1)).toBe(1);
  });

  it('returns 0 unchanged (no regen enemy)', () => {
    const es = makeES({ _veteranRegen: true, _noviceRegen: false });
    expect(es._applyVeteranRegen('grunt', 0)).toBe(0);
  });
});

// ── dealDamage ───────────────────────────────────────────────────────────────
describe('dealDamage()', () => {
  let es;

  beforeEach(() => {
    es = makeES();
    es._spawnDamageNumber = vi.fn();
    es._hitFlash          = vi.fn();
    es._spawnImpactFlash  = vi.fn();
    es._removeEnemy       = vi.fn();
    es._spawnSplashEffect = vi.fn();
  });

  it('returns false for unknown enemy id', () => {
    expect(es.dealDamage('nonexistent', 10)).toBe(false);
  });

  it('reduces enemy HP by the given amount', () => {
    const e = makeEnemy();
    es.enemies.push(e);
    es.dealDamage('e1', 30);
    expect(e.hp).toBe(70);
  });

  it('returns true and calls onEnemyKilled when HP drops to 0', () => {
    const e = makeEnemy({ hp: 20, maxHp: 20 });
    es.enemies.push(e);
    const result = es.dealDamage('e1', 25);
    expect(result).toBe(true);
    expect(es.onEnemyKilled).toHaveBeenCalledWith(e.reward);
  });

  it('applies damageReduction correctly', () => {
    const e = makeEnemy({ damageReduction: 0.5 }); // 50% reduction
    es.enemies.push(e);
    es.dealDamage('e1', 40);
    expect(e.hp).toBe(80); // 40 * 0.5 = 20 damage
  });

  it('always deals at least 1 damage even with max reduction', () => {
    const e = makeEnemy({ damageReduction: 0.99 });
    es.enemies.push(e);
    es.dealDamage('e1', 1);
    expect(e.hp).toBe(99);
  });

  it('reduces shieldHits on shielded enemy and halves damage', () => {
    const e = makeEnemy({ shieldHits: 2 });
    es.enemies.push(e);
    es.dealDamage('e1', 40);
    expect(e.shieldHits).toBe(1);
    expect(e.hp).toBe(80); // 40 * 0.5 = 20 damage
  });

  it('triggers enrage when HP falls below enrageThreshold', () => {
    const e = makeEnemy({ type: 'berserker', enrageThreshold: 0.4, hp: 100, maxHp: 100 });
    es.enemies.push(e);
    es.dealDamage('e1', 65); // hp → 35 = 35% < 40%
    expect(e.enraged).toBe(true);
    expect(e.speed).toBeGreaterThan(e.baseSpeed);
  });

  it('does not enrage twice', () => {
    const e = makeEnemy({ type: 'berserker', enrageThreshold: 0.4, hp: 50, maxHp: 100, enraged: true });
    const prevSpeed = e.speed;
    es.enemies.push(e);
    es.dealDamage('e1', 15);
    expect(e.speed).toBe(prevSpeed); // speed unchanged
  });
});

// ── applySlow ────────────────────────────────────────────────────────────────
describe('applySlow()', () => {
  let es;

  beforeEach(() => { es = makeES(); });

  it('sets slowAmt and slowTimer', () => {
    const e = makeEnemy();
    es.enemies.push(e);
    es.applySlow('e1', 0.45, 2000);
    expect(e.slowAmt).toBeCloseTo(0.45);
    expect(e.slowTimer).toBe(2000);
  });

  it('ignores slow-immune enemies', () => {
    const e = makeEnemy({ slowImmune: true });
    es.enemies.push(e);
    es.applySlow('e1', 0.45, 2000);
    expect(e.slowAmt).toBe(0);
  });

  it('caps slow at 0.95 even with bonus', () => {
    es._slowBonus = 3;
    const e = makeEnemy();
    es.enemies.push(e);
    es.applySlow('e1', 0.45, 2000);
    expect(e.slowAmt).toBeLessThanOrEqual(0.95);
  });

  it('is a no-op for unknown enemy id', () => {
    expect(() => es.applySlow('nonexistent', 0.5, 1000)).not.toThrow();
  });
});

// ── applyBurn ────────────────────────────────────────────────────────────────
describe('applyBurn()', () => {
  let es;

  beforeEach(() => { es = makeES(); });

  it('adds a burn stack', () => {
    const e = makeEnemy();
    es.enemies.push(e);
    es.applyBurn('e1', 8, 2500);
    expect(e.burns.length).toBe(1);
    expect(e.burns[0].dps).toBe(8);
  });

  it('stacks up to 3 burns', () => {
    const e = makeEnemy();
    es.enemies.push(e);
    es.applyBurn('e1', 8, 2500);
    es.applyBurn('e1', 8, 2500);
    es.applyBurn('e1', 8, 2500);
    expect(e.burns.length).toBe(3);
  });

  it('replaces oldest burn when already at 3 stacks', () => {
    const e = makeEnemy();
    es.enemies.push(e);
    es.applyBurn('e1', 5, 1000);
    es.applyBurn('e1', 6, 1000);
    es.applyBurn('e1', 7, 1000);
    es.applyBurn('e1', 10, 2000); // should replace index 0
    expect(e.burns.length).toBe(3);
    expect(e.burns[0].dps).toBe(10);
  });

  it('adds _burnExtraDps bonus to each stack', () => {
    es._burnExtraDps = 3;
    const e = makeEnemy();
    es.enemies.push(e);
    es.applyBurn('e1', 8, 2500);
    expect(e.burns[0].dps).toBe(11); // 8 + 3
  });
});

// ── setSlowBonus / setBurnBonus ──────────────────────────────────────────────
describe('setSlowBonus() / setBurnBonus()', () => {
  it('setSlowBonus updates _slowBonus', () => {
    const es = makeES();
    es.setSlowBonus(1.5);
    expect(es._slowBonus).toBe(1.5);
  });

  it('setBurnBonus accumulates _burnExtraDps and _burnExtraDuration', () => {
    const es = makeES();
    es.setBurnBonus(2, 500);
    es.setBurnBonus(3, 300);
    expect(es._burnExtraDps).toBe(5);
    expect(es._burnExtraDuration).toBe(800);
  });
});

// ── dealDamageToAll / dealDamageToLead ───────────────────────────────────────
describe('dealDamageToAll()', () => {
  it('applies damage to every enemy', () => {
    const es = makeES();
    es._spawnDamageNumber = vi.fn();
    es._hitFlash = vi.fn();
    es._spawnImpactFlash = vi.fn();
    es._removeEnemy = vi.fn();
    const e1 = makeEnemy({ id: 'e1' });
    const e2 = makeEnemy({ id: 'e2', hp: 50, maxHp: 50 });
    es.enemies.push(e1, e2);
    es.dealDamageToAll(10);
    expect(e1.hp).toBe(90);
    expect(e2.hp).toBe(40);
  });
});
