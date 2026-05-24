/**
 * Shadow Realm DLC — English translations
 * Prefix: dlc_sr_  (no collision with base keys)
 */

export default {
  // ── Warden ─────────────────────────────────────────
  dlc_sr_passive_name: 'Shadow Charge',
  dlc_sr_passive_desc: 'Each enemy kill generates +1 Shadow Charge. At 10 charges, a powerful shadow spell auto-casts for free.',
  dlc_sr_warden_locked: 'Requires Shadow Realm DLC',

  // ── Shadow Charge HUD ───────────────────────────────
  dlc_sr_log_auto_cast:    (spell) => `👁️ Shadow power unleashed! Auto-cast: ${spell}`,
  dlc_sr_log_shadow_charge:(n)    => `Shadow Charge: ${n}/10`,

  // ── Relic names ─────────────────────────────────────
  relic_shadow_crystal:        'Shadow Crystal',
  relic_shadow_crystal_desc:   'Shadow Strike towers deal +50% damage.',
  relic_void_lens:             'Void Lens',
  relic_void_lens_desc:        'Void Sentinel towers gain +60% attack range.',
  relic_phantom_edge:          'Phantom Edge',
  relic_phantom_edge_desc:     'All towers deal +12% damage.',
  relic_death_shroud:          'Death Shroud',
  relic_death_shroud_desc:     'Gain +2 gold per enemy killed.',
  relic_void_core:             'Void Core',
  relic_void_core_desc:        'All towers attack 20% faster.',
  relic_shadow_hoard:          'Shadow Hoard',
  relic_shadow_hoard_desc:     'Gain +5 gold on each wave clear.',
  relic_void_market:           'Void Market',
  relic_void_market_desc:      'Shop card costs reduced by 2g.',
  relic_souls_purse:           "Soul's Purse",
  relic_souls_purse_desc:      'Start each run with +15 bonus gold.',
  relic_shadow_ward:           'Shadow Ward',
  relic_shadow_ward_desc:      'Start with +1 Nexus HP.',
  relic_void_anchor:           'Void Anchor',
  relic_void_anchor_desc:      'Nexus can only be hit once per wave.',
  relic_death_veil:            'Death Veil',
  relic_death_veil_desc:       'All slow effects are 30% stronger.',
  relic_shadow_pact:           'Shadow Pact',
  relic_shadow_pact_desc:      'With 2+ Shadow towers, all Shadow damage +30%.',
  relic_void_echo_relic:       'Void Echo',
  relic_void_echo_relic_desc:  'Casting a spell fires all Void towers immediately. (8s cooldown)',
  log_void_echo_relic:         (n) => `Void Echo! ${n} Void tower(s) fired!`,
  relic_charge_crystal:        'Charge Crystal',
  relic_charge_crystal_desc:   'Shadow Warden: Shadow Charge triggers at 8 instead of 10.',
  relic_undying_will:          'Undying Will',
  relic_undying_will_desc:     'Shadow Warden only: every 5 kills grant +1 bonus Shadow Charge. Reach the auto-cast threshold faster.',

  // ── Map names ──────────────────────────────────────
  dlc_sr_map_void_corridor:    'Void Corridor',
  dlc_sr_map_phantom_crossing: 'Phantom Crossing',
  dlc_sr_map_abyssal_spiral:   'Abyssal Spiral',

  // ── Spell logs ─────────────────────────────────────
  spell_darkness:         (pct, dmg, s) => `Darkness! All enemies -${pct}% speed, all towers +${dmg}% damage for ${s}s!`,
  spell_shadow_nova:      (total)       => `Shadow Nova! ${total} total damage to wounded enemies!`,
  spell_void_pulse:       (n, steps)    => `Void Pulse! ${n} enemies pushed back ${steps} steps.`,
  spell_soul_feast:       (n, g)        => n > 0 ? `Soul Feast! ${n} enemies devoured → +${g} gold!` : 'Soul Feast: no enemies below threshold.',
  spell_soul_surge:       (pct, s)      => `Soul Surge! All towers +${pct}% damage for ${s}s!`,
  spell_abyssal_wave:     (d, pct, s)   => `Abyssal Wave! ${d} damage + ${pct}% slow for ${s}s!`,
  spell_shadow_step:      (n)           => `Shadow Step! ${n} enemies teleported to spawn.`,
  spell_death_toll:       (n)           => `Death Toll! +${n} gold for this wave's kills.`,
  spell_entropy_cascade:  (total)       => `Entropy Cascade! ${total} total damage (50% of current HP each).`,
  spell_void_collapse:    (pct, s)      => `Void Collapse! All enemies ${pct}% slow for ${s}s.`,
  spell_void_grasp:       (s)           => `Void Grasp! All enemies frozen for ${s}s.`,
  spell_phantom_strike:   (n, d)        => `Phantom Strike! ${n} enemies hit for ${d} damage.`,
};
