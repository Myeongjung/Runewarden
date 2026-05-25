/**
 * Solar Dominion DLC — English translations
 * Prefix: dlc_sd_  (no collision with base or DLC 1 keys)
 */

export default {
  // ── Warden ─────────────────────────────────────────
  dlc_sd_passive_name: 'Solar Charge',
  dlc_sd_passive_desc: 'Each spell cast (cost ≥ 2) generates +1 Solar Charge. At 8 charges, Solar Beam auto-casts for free.',
  dlc_sd_warden_locked: 'Requires Solar Dominion DLC',

  // ── Solar Charge HUD ────────────────────────────────
  dlc_sd_log_auto_cast:     (spell) => `☀️ Solar power unleashed! Auto-cast: ${spell}`,
  dlc_sd_log_solar_charge:  (n, max) => `Solar Charge: ${n}/${max}`,

  // ── Relic names ─────────────────────────────────────
  relic_solar_lens:           'Solar Lens',
  relic_solar_lens_desc:      'Divine Cannon towers gain +60% attack range.',
  relic_titan_bane:           'Titan Bane',
  relic_titan_bane_desc:      'Solar DoT deals +4 DPS and lasts 1.5s longer.',
  relic_radiant_core:         'Radiant Core',
  relic_radiant_core_desc:    'All towers deal +12% damage.',
  relic_solar_capacitor:      'Solar Capacitor',
  relic_solar_capacitor_desc: 'All towers attack 20% faster.',
  relic_crusader_relic:       "Crusader's Zeal",
  relic_crusader_relic_desc:  'Crusader stun duration increased by +200ms.',
  relic_solar_tribute:        'Solar Tribute',
  relic_solar_tribute_desc:   'Gain +6 gold on each wave clear.',
  relic_sun_market:           'Sun Market',
  relic_sun_market_desc:      'Shop card costs reduced by 2g.',
  relic_golden_chalice:       'Golden Chalice',
  relic_golden_chalice_desc:  'Start each run with +18 bonus gold.',
  relic_solar_ward:           'Solar Ward',
  relic_solar_ward_desc:      'Start with +1 Nexus HP.',
  relic_holy_bastion:         'Holy Bastion',
  relic_holy_bastion_desc:    'Nexus can only be hit once per wave.',
  relic_blinding_amulet:      'Blinding Amulet',
  relic_blinding_amulet_desc: 'All slow effects are 25% stronger.',
  relic_solar_pact_relic:     'Solar Pact',
  relic_solar_pact_relic_desc:'With 2+ Solar towers, all Solar damage +30%.',
  relic_light_prism_bonus:    'Prismatic Amplifier',
  relic_light_prism_bonus_desc:'Light Prism aura grants an additional +10% damage bonus to adjacent towers.',
  relic_solar_crown:          'Solar Crown',
  relic_solar_crown_desc:     'Solar Warden: Solar Charge triggers at 6 instead of 8.',
  relic_radiant_will:         'Radiant Will',
  relic_radiant_will_desc:    'Solar Warden: casting a spell costing 4+ grants +1 bonus Solar Charge.',

  // ── Map names ──────────────────────────────────────
  dlc_sd_map_solar_forum:       'Solar Forum',
  dlc_sd_map_sunken_temple:     'Sunken Temple',
  dlc_sd_map_blazing_corridor:  'Blazing Corridor',

  // ── Spell logs ─────────────────────────────────────
  spell_solar_beam:       (d, pct, s) => `Solar Beam! ${d} damage + ${pct}% slow for ${s}s to all enemies!`,
  spell_divine_shield:    (s)        => `Divine Shield! Nexus immune for ${s}s!`,
  spell_solar_flare:      (dps, s)   => `Solar Flare! ${dps} DPS Solar DoT applied to all enemies for ${s}s!`,
  spell_solar_tithe:      (g)        => `Solar Tithe! Spent ${g} gold — all enemies take ×2 damage!`,
  spell_radiant_burst:    (d)        => `Radiant Burst! ${d} damage to all enemies!`,
  spell_sunburst:         (d, pct, s)=> `Sunburst! ${d} damage to lead + ${pct}% slow for ${s}s!`,
  spell_gold_tithe:       (g)        => `Gold Tithe! +${g} gold from the field!`,
  spell_solar_nova:       (d)        => `Solar Nova! ${d} damage to all (double vs Solar DoT targets)!`,
  spell_heavenly_light:   (hp, g)    => `Heavenly Light! Nexus +${hp} HP, +${g} gold!`,
  spell_blinding_light:   (s)        => `Blinding Light! All enemies frozen for ${s}s!`,
  spell_solar_surge:      (pct, s)   => `Solar Surge! All towers +${pct}% attack speed for ${s}s!`,
  spell_divine_wrath:     (d)        => `Divine Wrath! ${d} damage to the lead enemy!`,
  spell_solar_corona:     (dps, s)   => `Solar Corona! Solar DoT ${dps} DPS for ${s}s + bonus Solar Charge!`,

  // ── Event logs ─────────────────────────────────────
  event_invest_gold_return: (g) => `Golden Investment returned! +${g} gold!`,
};
