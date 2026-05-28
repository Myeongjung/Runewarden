import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveSpell } from '../src/core/SpellResolver.js';

function makeCtx(overrides = {}) {
  return {
    addGold: vi.fn(),
    log: vi.fn(),
    i18n: { t: (k) => k },
    audio: { play: vi.fn() },
    enemySystem: {
      enemies: [],
      freezeAll: vi.fn(),
      dealDamageToAll: vi.fn(),
      dealDamageToLead: vi.fn(),
      dealDamageToRandom: vi.fn(),
      dealDamage: vi.fn(),
      slowAll: vi.fn(),
      teleportToStart: vi.fn(),
      getEnemiesInRange: vi.fn().mockReturnValue([]),
      pushBack: vi.fn(),
    },
    towerSystem: {
      towers: new Map(),
      applyGlobalSpeedBoost: vi.fn(),
      applyGlobalDamageBoost: vi.fn(),
      triggerAllTeslas: vi.fn().mockReturnValue(0),
    },
    cardSystem: {
      hand: [],
      discardPile: [],
      drawExtra: vi.fn(),
      discardHand: vi.fn(),
    },
    state: {},
    hasRelic: vi.fn().mockReturnValue(false),
    renderHand: vi.fn(),
    applyNexusHeal: vi.fn(),
    ...overrides,
  };
}

describe('resolveSpell', () => {
  let ctx;

  beforeEach(() => {
    ctx = makeCtx();
  });

  // ── gold ───────────────────────────────────────────────
  describe('gold', () => {
    it('calls addGold(amount, null)', () => {
      resolveSpell({ type: 'gold', amount: 5 }, ctx);
      expect(ctx.addGold).toHaveBeenCalledWith(5, null);
    });

    it('stores effect as lastSpellEffect on ctx.state', () => {
      const effect = { type: 'gold', amount: 3 };
      resolveSpell(effect, ctx);
      expect(ctx.state.lastSpellEffect).toBe(effect);
    });
  });

  // ── draw ───────────────────────────────────────────────
  describe('draw', () => {
    it('calls cardSystem.drawExtra with effect.count', () => {
      resolveSpell({ type: 'draw', count: 2 }, ctx);
      expect(ctx.cardSystem.drawExtra).toHaveBeenCalledWith(2);
    });

    it('calls renderHand', () => {
      resolveSpell({ type: 'draw', count: 1 }, ctx);
      expect(ctx.renderHand).toHaveBeenCalled();
    });
  });

  // ── freeze ─────────────────────────────────────────────
  describe('freeze', () => {
    it('calls enemySystem.freezeAll with effect.duration', () => {
      resolveSpell({ type: 'freeze', duration: 2000 }, ctx);
      expect(ctx.enemySystem.freezeAll).toHaveBeenCalledWith(2000);
    });

    it('plays spell_freeze audio', () => {
      resolveSpell({ type: 'freeze', duration: 2000 }, ctx);
      expect(ctx.audio.play).toHaveBeenCalledWith('spell_freeze');
    });
  });

  // ── tower_rally ────────────────────────────────────────
  describe('tower_rally', () => {
    it('resets all tower cooldowns to 0', () => {
      const t1 = { cooldown: 100 };
      const t2 = { cooldown: 250 };
      ctx.towerSystem.towers.set('a', t1);
      ctx.towerSystem.towers.set('b', t2);
      resolveSpell({ type: 'tower_rally' }, ctx);
      expect(t1.cooldown).toBe(0);
      expect(t2.cooldown).toBe(0);
    });

    it('plays wave_start audio', () => {
      resolveSpell({ type: 'tower_rally' }, ctx);
      expect(ctx.audio.play).toHaveBeenCalledWith('wave_start');
    });

    it('works with empty tower map', () => {
      expect(() => resolveSpell({ type: 'tower_rally' }, ctx)).not.toThrow();
    });
  });

  // ── void_echo ──────────────────────────────────────────
  describe('void_echo', () => {
    it('re-resolves lastSpellEffect when it is not void_echo', () => {
      ctx.state.lastSpellEffect = { type: 'gold', amount: 7 };
      resolveSpell({ type: 'void_echo' }, ctx);
      expect(ctx.addGold).toHaveBeenCalledWith(7, null);
    });

    it('logs spell_void_echo_empty when no lastSpellEffect', () => {
      resolveSpell({ type: 'void_echo' }, ctx);
      expect(ctx.log).toHaveBeenCalledWith('spell_void_echo_empty', '');
    });

    it('logs spell_void_echo_empty when lastSpellEffect is itself void_echo', () => {
      ctx.state.lastSpellEffect = { type: 'void_echo' };
      resolveSpell({ type: 'void_echo' }, ctx);
      expect(ctx.log).toHaveBeenCalledWith('spell_void_echo_empty', '');
    });

    it('does NOT update lastSpellEffect', () => {
      resolveSpell({ type: 'void_echo' }, ctx);
      expect(ctx.state.lastSpellEffect).toBeUndefined();
    });
  });

  // ── heal_nexus ─────────────────────────────────────────
  describe('heal_nexus', () => {
    it('calls applyNexusHeal with amount and options', () => {
      resolveSpell({ type: 'heal_nexus', amount: 2, goldOnFull: 3 }, ctx);
      expect(ctx.applyNexusHeal).toHaveBeenCalledWith(2, { isSpell: true, goldOnFull: 3 });
    });

    it('defaults goldOnFull to 0 when not provided', () => {
      resolveSpell({ type: 'heal_nexus', amount: 1 }, ctx);
      expect(ctx.applyNexusHeal).toHaveBeenCalledWith(1, { isSpell: true, goldOnFull: 0 });
    });
  });

  // ── gold_per_enemy ─────────────────────────────────────
  describe('gold_per_enemy', () => {
    it('adds gold equal to enemy count', () => {
      ctx.enemySystem.enemies = [{ id: 1 }, { id: 2 }, { id: 3 }];
      resolveSpell({ type: 'gold_per_enemy' }, ctx);
      expect(ctx.addGold).toHaveBeenCalledWith(3, null);
    });

    it('logs no_enemies when no enemies are present', () => {
      resolveSpell({ type: 'gold_per_enemy' }, ctx);
      expect(ctx.addGold).not.toHaveBeenCalled();
      expect(ctx.log).toHaveBeenCalledWith('spell_no_enemies', '');
    });
  });

  // ── unknown type ───────────────────────────────────────
  describe('unknown type', () => {
    it('calls log with unknown spell message', () => {
      resolveSpell({ type: 'totally_fake_spell' }, ctx);
      expect(ctx.log).toHaveBeenCalledWith('Unknown spell effect: totally_fake_spell', '');
    });

    it('still sets lastSpellEffect even for unknown types', () => {
      const effect = { type: 'totally_fake_spell' };
      resolveSpell(effect, ctx);
      expect(ctx.state.lastSpellEffect).toBe(effect);
    });
  });

  // ── storm_circuit relic post-processing ───────────────
  describe('storm_circuit relic', () => {
    it('triggers teslas when relic is owned and enemies are present', () => {
      ctx.hasRelic = vi.fn().mockImplementation(id => id === 'storm_circuit');
      ctx.enemySystem.enemies = [{ id: 1 }];
      ctx.towerSystem.triggerAllTeslas.mockReturnValue(2);
      resolveSpell({ type: 'gold', amount: 1 }, ctx);
      expect(ctx.towerSystem.triggerAllTeslas).toHaveBeenCalled();
      expect(ctx.log).toHaveBeenCalledWith('log_storm_circuit', 'good');
    });

    it('does not trigger teslas when no enemies are present', () => {
      ctx.hasRelic = vi.fn().mockImplementation(id => id === 'storm_circuit');
      ctx.enemySystem.enemies = [];
      resolveSpell({ type: 'gold', amount: 1 }, ctx);
      expect(ctx.towerSystem.triggerAllTeslas).not.toHaveBeenCalled();
    });

    it('does NOT trigger storm_circuit for _isAutocast spells', () => {
      ctx.hasRelic = vi.fn().mockImplementation(id => id === 'storm_circuit');
      ctx.enemySystem.enemies = [{ id: 1 }];
      ctx.towerSystem.triggerAllTeslas.mockReturnValue(2);
      resolveSpell({ type: 'gold', amount: 1, _isAutocast: true }, ctx);
      expect(ctx.towerSystem.triggerAllTeslas).not.toHaveBeenCalled();
    });
  });

  // ── DLC 2 Solar Dominion spells ───────────────────────
  describe('solar_beam', () => {
    it('deals damage to all enemies and slows them', () => {
      ctx.enemySystem.enemies = [{ id: 'e1' }, { id: 'e2' }];
      resolveSpell({ type: 'solar_beam', damage: 50, slow: 0.30, slowDur: 3000 }, ctx);
      expect(ctx.enemySystem.dealDamageToAll).toHaveBeenCalledWith(50, 'solar');
      expect(ctx.enemySystem.slowAll).toHaveBeenCalledWith(0.30, 3000);
    });
  });

  describe('divine_shield', () => {
    it('sets _divineShieldActive on state', () => {
      resolveSpell({ type: 'divine_shield', duration: 10000 }, ctx);
      expect(ctx.state._divineShieldActive).toBe(true);
      expect(ctx.state._divineShieldExpiry).toBeGreaterThan(Date.now());
    });
  });

  describe('damage_lead (sunburst variant)', () => {
    it('deals damage to lead enemy and applies slow', () => {
      const lead = { id: 'lead1', x: 10, y: 10 };
      ctx.enemySystem.dealDamageToLead = vi.fn().mockReturnValue(lead);
      ctx.enemySystem.applySlow = vi.fn();
      resolveSpell({ type: 'damage_lead', amount: 25, slow: 0.40, slowDur: 4000 }, ctx);
      expect(ctx.enemySystem.dealDamageToLead).toHaveBeenCalledWith(25, null);
      expect(ctx.enemySystem.applySlow).toHaveBeenCalledWith('lead1', 0.40, 4000);
    });

    it('deals high damage to lead with no slow (divine_wrath)', () => {
      const lead = { id: 'lead1' };
      ctx.enemySystem.dealDamageToLead = vi.fn().mockReturnValue(lead);
      ctx.enemySystem.applySlow = vi.fn();
      resolveSpell({ type: 'damage_lead', amount: 90 }, ctx);
      expect(ctx.enemySystem.dealDamageToLead).toHaveBeenCalledWith(90, null);
      expect(ctx.enemySystem.applySlow).not.toHaveBeenCalled();
    });
  });

  describe('solar_dot_all', () => {
    it('applies solar dot to all enemies via enemySystem', () => {
      ctx.enemySystem.applySolarDotAll = vi.fn();
      resolveSpell({ type: 'solar_dot_all', dps: 15, duration: 4000 }, ctx);
      expect(ctx.enemySystem.applySolarDotAll).toHaveBeenCalledWith(15, 4000);
    });
  });

  describe('gold_per_enemy with mult', () => {
    it('respects the mult parameter', () => {
      ctx.enemySystem.enemies = [{ id: 1 }, { id: 2 }];
      resolveSpell({ type: 'gold_per_enemy', mult: 2 }, ctx);
      expect(ctx.addGold).toHaveBeenCalledWith(4, null);
    });
  });
});
