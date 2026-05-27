/**
 * SpellResolver — 스펠 효과 처리 핸들러 맵
 *
 * 각 스펠 타입 → 핸들러 함수로 등록. 새 스펠 추가 시 이 파일에만 case를 추가하면 됩니다.
 * ctx: { addGold, log, i18n, enemySystem, towerSystem, cardSystem, state, hasRelic, renderHand, audio }
 *
 * GameEngine에서는 `resolveSpell(effect, ctx)` 한 줄만 호출합니다.
 */

// ── 기본 스펠 핸들러 ─────────────────────────────────
const BASE_HANDLERS = {
  gold(effect, { addGold, log, i18n }) {
    addGold(effect.amount, null);
    log(i18n.t('spell_gold', effect.amount), 'gold');
  },

  freeze(effect, { enemySystem, log, i18n, audio }) {
    enemySystem.freezeAll(effect.duration);
    audio.play('spell_freeze');
    if (effect.duration >= 4000) {
      log(i18n.t('spell_time_stop', effect.duration / 1000), 'good');
    } else {
      log(i18n.t('spell_freeze'), 'good');
    }
  },

  damage_all(effect, { enemySystem, log, i18n }) {
    enemySystem.dealDamageToAll(effect.amount);
    if (effect.amount >= 70) {
      log(i18n.t('spell_crimson_tide', effect.amount), 'good');
    } else {
      log(i18n.t('spell_damage_all', effect.amount), 'good');
    }
  },

  slow_all(effect, { enemySystem, log, i18n }) {
    enemySystem.slowAll(effect.amount, effect.duration);
    if (effect.label === 'decay') {
      log(i18n.t('spell_decay', Math.round(effect.amount * 100), effect.duration / 1000), 'good');
    } else if (effect.amount >= 0.65) {
      log(i18n.t('spell_mass_slow', Math.round(effect.amount * 100), effect.duration / 1000), 'good');
    } else {
      log(i18n.t('spell_slow_all', Math.round(effect.amount * 100), effect.duration / 1000), 'good');
    }
  },

  damage_random(effect, { enemySystem, log, i18n }) {
    enemySystem.dealDamageToRandom(effect.count, effect.amount);
    if (effect.count >= 5) {
      log(i18n.t('spell_arcane_storm', effect.count, effect.amount), 'good');
    } else if (effect.count === 1) {
      log(i18n.t('spell_void_bolt', effect.amount), 'good');
    } else {
      log(i18n.t('spell_lightning', effect.count, effect.amount), 'good');
    }
  },

  chain_damage(effect, { enemySystem, log, i18n }) {
    const CHAIN_RADIUS = 120;
    const lead = enemySystem.dealDamageToLead(effect.damage);
    if (lead) {
      const nearby = enemySystem.getEnemiesInRange(lead.x, lead.y, CHAIN_RADIUS)
        .filter(e => e.id !== lead.id)
        .slice(0, effect.chainCount);
      for (const e of nearby) enemySystem.dealDamage(e.id, effect.chainDmg);
      log(i18n.t('spell_chain_bolt_hit', effect.damage, nearby.length, effect.chainDmg), 'good');
    } else {
      log(i18n.t('spell_chain_bolt_miss'), '');
    }
  },

  heal_nexus(effect, { applyNexusHeal }) {
    applyNexusHeal(effect.amount, { isSpell: true, goldOnFull: effect.goldOnFull ?? 0 });
  },

  draw(effect, { cardSystem, renderHand, log, i18n }) {
    cardSystem.drawExtra(effect.count);
    renderHand();
    if (effect.count >= 4) {
      log(i18n.t('spell_warden_call', effect.count), 'good');
    } else {
      log(i18n.t('spell_draw', effect.count), 'good');
    }
  },

  speed_boost_all(effect, { towerSystem, log, i18n }) {
    towerSystem.applyGlobalSpeedBoost(effect.mult, effect.duration);
    if (effect.mult <= 0.34) {
      log(i18n.t('spell_overdrive', effect.duration / 1000), 'good');
    } else {
      log(i18n.t('spell_speed_boost', Math.round(1 / effect.mult), effect.duration / 1000), 'good');
    }
  },

  damage_boost_all(effect, { towerSystem, log, i18n }) {
    towerSystem.applyGlobalDamageBoost(effect.mult, effect.duration);
    log(i18n.t('spell_dmg_boost', effect.mult, effect.duration / 1000), 'good');
  },

  nova(effect, { enemySystem, log, i18n }) {
    enemySystem.dealDamageToAll(effect.damage);
    enemySystem.slowAll(effect.slowAmt, effect.slowDuration);
    if (effect.damage <= 20) {
      log(i18n.t('spell_ice_storm', effect.damage, Math.round(effect.slowAmt * 100), effect.slowDuration / 1000), 'good');
    } else if (effect.damage <= 45) {
      log(i18n.t('spell_ember_rain', effect.damage, Math.round(effect.slowAmt * 100), effect.slowDuration / 1000), 'good');
    } else {
      log(i18n.t('spell_nova', effect.damage, Math.round(effect.slowAmt * 100), effect.slowDuration / 1000), 'good');
    }
  },

  gold_draw(effect, { addGold, cardSystem, renderHand, log, i18n }) {
    addGold(effect.amount, null);
    cardSystem.drawExtra(effect.draw);
    renderHand();
    if (effect.draw >= 2) {
      log(i18n.t('spell_life_tap', effect.amount, effect.draw), 'gold');
    } else {
      log(i18n.t('spell_gold_draw', effect.amount, effect.draw), 'gold');
    }
  },

  tower_rally(_effect, { towerSystem, log, i18n, audio }) {
    for (const t of towerSystem.towers.values()) t.cooldown = 0;
    log(i18n.t('spell_tower_rally'), 'good');
    audio.play('wave_start');
  },

  gold_per_enemy(_effect, { enemySystem, addGold, log, i18n }) {
    const count = enemySystem.enemies.length;
    if (count > 0) {
      addGold(count, null);
      log(i18n.t('spell_soul_harvest', count), 'gold');
    } else {
      log(i18n.t('spell_no_enemies'), '');
    }
  },

  nature_cycle(_effect, { cardSystem, renderHand, log, i18n }) {
    cardSystem.discardHand();
    cardSystem.drawExtra(5);
    renderHand();
    log(i18n.t('spell_nature_cycle'), 'good');
  },

  rally_cry(effect, { towerSystem, log, i18n }) {
    towerSystem.applyGlobalDamageBoost(effect.dmgMult, effect.duration);
    towerSystem.applyGlobalSpeedBoost(effect.spdMult, effect.duration);
    log(i18n.t('spell_rally_cry', Math.round((effect.dmgMult - 1) * 100), effect.duration / 1000), 'good');
  },

  freeze_damage(effect, { enemySystem, log, i18n, audio }) {
    enemySystem.freezeAll(effect.duration);
    enemySystem.dealDamageToAll(effect.damage);
    audio.play('spell_freeze');
    log(i18n.t('spell_cryowave', effect.damage, (effect.duration / 1000).toFixed(1)), 'good');
  },

  teleport_all(_effect, { enemySystem, log, i18n, audio }) {
    enemySystem.teleportToStart();
    log(i18n.t('spell_void_rift'), 'good');
    audio.play('spell_freeze');
  },

  // ── Shadow Warden 스펠 ───────────────────────────────

  damage_all_gold_kill(effect, { enemySystem, addGold, log, i18n }) {
    const beforeCount = enemySystem.enemies.length;
    enemySystem.dealDamageToAll(effect.amount);
    const killed = beforeCount - enemySystem.enemies.length;
    if (killed > 0) addGold(killed, null, true);
    log(i18n.t('spell_soul_drain', effect.amount, killed), killed > 0 ? 'gold' : 'good');
  },

  recall_discard(effect, { cardSystem, renderHand, log, i18n }) {
    const available = cardSystem.discardPile.length;
    const count = Math.min(effect.count, available);
    if (count > 0) {
      const recalled = cardSystem.discardPile.splice(-count);
      cardSystem.hand.push(...recalled);
      renderHand();
      log(i18n.t('spell_grave_call', count), 'good');
    } else {
      log(i18n.t('spell_no_discard'), '');
    }
  },

  percent_hp_damage(effect, { enemySystem, log, i18n }) {
    const enemies = [...enemySystem.enemies];
    let totalDmg = 0;
    for (const e of enemies) {
      const dmg = Math.max(1, Math.ceil(e.hp * effect.percent));
      enemySystem.dealDamage(e.id, dmg);
      totalDmg += dmg;
    }
    log(i18n.t('spell_entropy', Math.round(effect.percent * 100), totalDmg), 'good');
  },

  damage_highest_hp(effect, { enemySystem, log, i18n }) {
    const sorted = [...enemySystem.enemies].sort((a, b) => b.hp - a.hp);
    if (sorted.length > 0) {
      enemySystem.dealDamage(sorted[0].id, effect.amount);
      log(i18n.t('spell_dark_matter', effect.amount), 'good');
    } else {
      log(i18n.t('spell_no_enemies'), '');
    }
  },

  void_echo(effect, { state, log, i18n, resolveSpell }) {
    if (state.lastSpellEffect && state.lastSpellEffect.type !== 'void_echo') {
      log(i18n.t('spell_void_echo', state.lastSpellEffect.type), 'good');
      resolveSpell(state.lastSpellEffect);
    } else {
      log(i18n.t('spell_void_echo_empty'), '');
    }
  },

  discard_for_gold(effect, { cardSystem, addGold, renderHand, log, i18n }) {
    const handCount = cardSystem.hand.length;
    cardSystem.discardHand();
    renderHand();
    const gained = handCount * effect.goldPerCard;
    if (gained > 0) addGold(gained, null);
    log(i18n.t('spell_sacrifice', handCount, gained), 'gold');
  },

  // ── DLC Shadow Realm 스펠 ───────────────────────────

  darkness(effect, { enemySystem, towerSystem, log, i18n, audio }) {
    enemySystem.slowAll(effect.slowAmt, effect.duration);
    towerSystem.applyGlobalDamageBoost(1 + effect.dmgBoost, effect.duration);
    audio.play('spell_freeze');
    log(i18n.t('spell_darkness',
      Math.round(effect.slowAmt * 100),
      Math.round(effect.dmgBoost * 100),
      effect.duration / 1000), 'good');
  },

  shadow_nova(effect, { enemySystem, log, i18n }) {
    const enemies = [...enemySystem.enemies];
    let totalDmg = 0;
    for (const e of enemies) {
      const missing = Math.max(0, e.maxHp - e.hp);
      const dmg = Math.max(1, Math.ceil(missing * effect.pct));
      enemySystem.dealDamage(e.id, dmg);
      totalDmg += dmg;
    }
    log(i18n.t('spell_shadow_nova', totalDmg), 'good');
  },

  void_pulse(effect, { enemySystem, log, i18n, audio }) {
    const sorted = [...enemySystem.enemies]
      .sort((a, b) => (b.pathProgress ?? 0) - (a.pathProgress ?? 0))
      .slice(0, effect.count ?? 3);
    for (const e of sorted) {
      enemySystem.pushBack(e.id, effect.steps ?? 3);
    }
    log(i18n.t('spell_void_pulse', sorted.length, effect.steps ?? 3), 'good');
    audio.play('spell_freeze');
  },

  soul_feast(effect, { enemySystem, addGold, log, i18n }) {
    const threshold = effect.hpThreshold ?? 0.25;
    const goldEach  = effect.goldPerKill ?? 3;
    const targets   = enemySystem.enemies.filter(e => e.hp / e.maxHp <= threshold);
    let gained = 0;
    for (const e of targets) {
      enemySystem.dealDamage(e.id, e.hp + 9999);
      gained += goldEach;
    }
    if (gained > 0) addGold(gained, null, true);
    log(i18n.t('spell_soul_feast', targets.length, gained), targets.length > 0 ? 'gold' : '');
  },

  gold_per_wave_kill(_effect, { state, addGold, log, i18n }) {
    const kills = state?.stats?.enemiesKilledThisWave ?? 0;
    if (kills > 0) {
      addGold(kills, null);
      log(i18n.t('spell_death_toll', kills), 'gold');
    } else {
      log(i18n.t('spell_no_enemies'), '');
    }
  },

  // ── DLC 2 Solar Dominion 스펠 핸들러 ─────────────────

  solar_beam(effect, { enemySystem, log, i18n }) {
    enemySystem.dealDamageToAll(effect.damage ?? 50);
    if (effect.slow > 0) enemySystem.slowAll(effect.slow, effect.slowDur ?? 3000);
    log(i18n.t('spell_solar_beam', effect.damage ?? 50, Math.round((effect.slow ?? 0.30) * 100), (effect.slowDur ?? 3000) / 1000), 'good');
  },

  divine_shield(effect, { state, log, i18n }) {
    if (!state) return;
    const dur = effect.duration ?? 10000;
    state._divineShieldActive = true;
    state._divineShieldExpiry = Date.now() + dur;
    setTimeout(() => { if (state) state._divineShieldActive = false; }, dur);
    log(i18n.t('spell_divine_shield', dur / 1000), 'good');
  },

  solar_dot_all(effect, { enemySystem, log, i18n }) {
    enemySystem.applySolarDotAll?.(effect.dps ?? 15, effect.duration ?? 4000);
    log(i18n.t('spell_solar_flare', effect.dps ?? 15, (effect.duration ?? 4000) / 1000), 'good');
  },

  solar_tithe(effect, { state, enemySystem, addGold, spendGold, log, i18n }) {
    if (!state) return;
    const spend = Math.floor(state.gold * (effect.goldPct ?? 0.25));
    if (spend > 0 && spendGold) spendGold(spend);
    log(i18n.t('spell_solar_tithe', spend), 'gold');
    // DLC 2: enemies take ×2 damage — apply as a state flag (handled per-hit in TowerSystem or via temp stun)
    // Simple approach: deal immediate bonus damage to all enemies
    if (effect.damageMult && effect.damageMult > 1) {
      for (const e of [...enemySystem.enemies]) {
        enemySystem.dealDamage(e.id, Math.floor(e.maxHp * 0.04));  // 즉시 타격 4% 최대 HP
      }
    }
  },

  damage_lead(effect, { enemySystem, log, i18n }) {
    const lead = enemySystem.dealDamageToLead(effect.amount);
    if (effect.slow > 0 && lead) {
      enemySystem.applySlow(lead.id, effect.slow, effect.slowDur ?? 3000);
    }
    if (effect.slow > 0) {
      log(i18n.t('spell_sunburst', effect.amount, Math.round((effect.slow ?? 0.40) * 100), (effect.slowDur ?? 4000) / 1000), 'good');
    } else {
      log(i18n.t('spell_divine_wrath', effect.amount), 'good');
    }
  },

  gold_per_enemy(effect, { enemySystem, addGold, log, i18n }) {
    const count  = enemySystem.enemies.length;
    if (count === 0) { log(i18n.t('spell_no_enemies'), ''); return; }
    const gained = Math.min(count, 8) * (effect.mult ?? 1);
    addGold(gained, null);
    log(i18n.t('spell_gold_tithe', gained), 'gold');
  },

  damage_all_solar_bonus(effect, { enemySystem, log, i18n }) {
    for (const e of [...enemySystem.enemies]) {
      const dmg = (e.solarDots?.length > 0)
        ? Math.floor(effect.amount * (effect.solarBonusMult ?? 2))
        : effect.amount;
      enemySystem.dealDamage(e.id, dmg);
    }
    log(i18n.t('spell_solar_nova', effect.amount), 'good');
  },

  heal_nexus_gold(effect, { applyNexusHeal, addGold, log, i18n }) {
    applyNexusHeal(effect.healAmount ?? 1, { isSpell: true });
    if (effect.goldAmount > 0) addGold(effect.goldAmount, null);
    log(i18n.t('spell_heavenly_light', effect.healAmount ?? 1, effect.goldAmount ?? 10), 'good');
  },

  freeze_all(effect, { enemySystem, log, i18n, audio }) {
    enemySystem.freezeAll(effect.duration ?? 2500);
    audio.play('spell_freeze');
    log(i18n.t('spell_blinding_light', (effect.duration ?? 2500) / 1000), 'good');
  },

  tower_speed_temp(effect, { towerSystem, log, i18n }) {
    if (!towerSystem) return;
    const pct  = Math.round((1 / (effect.mult ?? 0.625) - 1) * 100);
    const dur  = effect.duration ?? 5000;
    towerSystem.addRelicSpeedBonus?.('__all__', effect.mult ?? 0.625);
    setTimeout(() => towerSystem.addRelicSpeedBonus?.('__all__', 1 / (effect.mult ?? 0.625)), dur);
    log(i18n.t('spell_solar_surge', pct, dur / 1000), 'good');
  },

  solar_dot_all_charge(effect, { enemySystem, state, log, i18n }) {
    enemySystem.applySolarDotAll?.(effect.dps ?? 12, effect.duration ?? 3000);
    if (state && effect.bonusCharge > 0) {
      state._solarChargeCount = Math.min(
        (state._solarChargeCount ?? 0) + effect.bonusCharge,
        (state._solarChargeMax ?? 8) - 1
      );
    }
    log(i18n.t('spell_solar_corona', effect.dps ?? 12, (effect.duration ?? 3000) / 1000), 'good');
  },
};

/**
 * 스펠 하나를 처리합니다.
 * @param {object} effect - 카드 effect 정의 (type, ...params)
 * @param {object} ctx    - GameEngine에서 주입되는 의존성 묶음
 */
export function resolveSpell(effect, ctx) {
  const handler = BASE_HANDLERS[effect.type];
  if (handler) {
    // void_echo가 재귀 호출할 수 있도록 ctx에 resolveSpell 자체를 포함
    handler(effect, { ...ctx, resolveSpell: (e) => resolveSpell(e, ctx) });
  } else {
    ctx.log(`Unknown spell effect: ${effect.type}`, '');
  }

  // 모든 스펠 공통 후처리
  if (effect.type !== 'void_echo' && ctx.state) {
    ctx.state.lastSpellEffect = effect;
  }
  // _isAutocast 가드: 자동 시전 주문은 storm_circuit/void_echo_relic 연쇄 트리거 차단
  if (!effect._isAutocast) {
    if (ctx.hasRelic('storm_circuit') && ctx.towerSystem && ctx.enemySystem?.enemies?.length > 0) {
      const count = ctx.towerSystem.triggerAllTeslas();
      if (count > 0) ctx.log(ctx.i18n.t('log_storm_circuit', count), 'good');
    }
  }

  // Void Echo Relic: Void 태그 타워 즉시 발사 (8초 쿨다운) — autocast 연쇄 차단
  if (!effect._isAutocast && ctx.hasRelic('void_echo_relic') && ctx.towerSystem && ctx.enemySystem?.enemies?.length > 0) {
    const now = Date.now();
    const lastFired = ctx.state?._voidEchoLastFired ?? 0;
    const relicEffect = ctx.state?.relics?.find(r => r.id === 'void_echo_relic')?.effect;
    const cd = relicEffect?.cooldownMs ?? 8000;
    if (now - lastFired >= cd) {
      if (ctx.state) ctx.state._voidEchoLastFired = now;
      const count = ctx.towerSystem.triggerAllByTag('Void');
      if (count > 0) ctx.log(ctx.i18n.t('log_void_echo_relic', count), 'good');
    }
  }
}
