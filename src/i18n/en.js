/** Runewarden — English (en) */
import dlcShadowEn from '../dlc/shadow_realm/i18n/en.js';
import dlcSolarEn  from '../dlc/solar_dominion/i18n/en.js';

const _BASE_EN = {
  // ── 메인 메뉴 ───────────────────────────────────────
  title:           'RUNEWARDEN',
  subtitle:        'Build your deck. Place your towers. Survive.',
  btn_new_run:     '▶ New Run',
  btn_codex:       '📖 Warden Codex',
  btn_how_to_play: 'How to Play',
  btn_replay_tut:  '↩ Replay Tutorial',
  warden_rank:     'WARDEN RANK',
  stat_runs:       (n) => `Runs: ${n}`,
  stat_wins:       (n) => `Wins: ${n}`,
  stat_kills:      (n) => `Kills: ${n}`,

  // ── Warden 선택 ─────────────────────────────────────
  warden_select_title: 'Choose Your Warden',
  warden_select_sub:   'Each Warden begins with a unique deck and passive ability.',
  warden_select_back:  '← Back',
  warden_locked:       (rank) => `Unlock at Rank ${rank}`,
  warden_selected:     '✓ Selected',
  warden_select_btn:   '▶ Select',
  passive_label:       'PASSIVE',

  // ── 게임 HUD ────────────────────────────────────────
  hud_wave:  'WAVE',
  hud_gold:  'GOLD',
  hud_nexus: 'NEXUS',
  hud_deck:  'DECK',
  act_label: (n) => `ACT ${n}`,

  // ── 웨이브 버튼 ─────────────────────────────────────
  btn_start_wave:      'Start Wave',
  btn_wave_in_progress:'Wave in Progress...',
  btn_start_wave_n:    (n) => `Start Wave ${n}`,

  // ── 상점 ────────────────────────────────────────────
  shop_title:     "Warden's Shop",
  shop_subtitle:  'Choose cards to add to your deck.',
  shop_reroll:    '🎲 Reroll',
  shop_leave:     'Leave Shop →',
  shop_rerolls_left: (n) => `${n} left`,
  shop_no_rerolls:   'No rerolls',
  shop_cant_afford:   (cost) => `✗ Need ${cost}g`,
  shop_buy:           '✓ Buy',
  shop_after_wave:    (n) => `— After Wave ${n}`,
  shop_sold:          'SOLD',
  shop_not_enough_gold: 'Not enough gold to reroll.',
  shop_bought:        (name) => `Bought: ${name} (+1 to deck)`,
  shop_rerolled:      (left) => `Rerolled the shop. (${left} rerolls left)`,

  // ── 노드 선택 ────────────────────────────────────────
  node_title:     'Choose Your Path',
  node_shop:      '🏪 Shop',
  node_event:     '📜 Event',
  node_rest:      '🏕️ Rest',
  node_shop_desc: 'Visit the Warden\'s Shop. Buy and reroll cards.',
  node_event_desc:'Encounter a random event. Risk or reward.',
  node_rest_desc: 'Rest at camp. Remove a card from your deck.',

  // ── 이벤트 ──────────────────────────────────────────
  event_title:    'Event',
  event_choose:   'Choose wisely.',
  event_accept:   '✓ Accept',
  event_decline:  '✗ Decline',
  event_close:    'Continue →',

  // ── 휴식 ────────────────────────────────────────────
  rest_title:     'Warden\'s Rest',
  rest_subtitle:  'Remove a card from your deck to streamline your strategy.',
  rest_gold_bonus:'Take 10 gold instead',
  rest_close:     'Continue →',
  rest_removed:   (name) => `Removed ${name} from your deck.`,
  rest_gold_taken:'Took 10 gold instead.',
  rest_deck_min:  'Your deck is too small to remove cards.',

  // ── 일시정지 ─────────────────────────────────────────
  pause_title:    '⚙️ Paused',
  btn_resume:     '▶ Resume',
  btn_how_pause:  '📖 How to Play',
  btn_quit_menu:  '✕ Quit to Menu',
  vol_label:      '🔊 Volume',

  // ── 챌린지 ────────────────────────────────────────────
  challenge_section_title: '⚔️ Challenges (Optional)',
  challenge_xp_bonus:      (n) => `XP +${n}%`,
  challenge_xp_none:       'No bonus',
  challenge_cat_tower:     '🏰 Tower Restrictions',
  challenge_cat_card:      '🃏 Card Restrictions',
  challenge_cat_economy:   '💰 Economy Restrictions',
  challenge_cat_run:       '⚔️ Run Conditions',
  ch_cat_tower:            '🏰 Tower Restrictions',
  ch_cat_card:             '🃏 Card Restrictions',
  ch_cat_economy:          '💰 Economy Restrictions',
  ch_cat_run:              '⚔️ Run Conditions',

  ch_archer_only_name: "Archer's Fortress",
  ch_archer_only_desc: 'Only Archer-type towers can be summoned.',
  ch_no_frost_name:    'Oath of Fire',
  ch_no_frost_desc:    'Frost-type towers (Frost Mage, etc.) cannot be used.',
  ch_no_aoe_name:      'Single Target Only',
  ch_no_aoe_desc:      'AoE towers (Cannon, Tesla Coil) cannot be used.',
  ch_no_spells_name:   'Silence',
  ch_no_spells_desc:   'Spell cards cannot be played.',
  ch_no_augments_name: 'Bare Hands',
  ch_no_augments_desc: 'Augment cards cannot be used.',
  ch_common_only_name: "Commoner's Deck",
  ch_common_only_desc: 'Only Common rarity cards can be purchased.',
  ch_fixed_deck_name:  'Immutable Deck',
  ch_fixed_deck_desc:  'No cards can be purchased from the shop.',
  ch_poverty_name:     'Poverty Run',
  ch_poverty_desc:     'Start with 10g instead of the normal amount.',
  ch_no_reroll_name:   'No Second Chances',
  ch_no_reroll_desc:   'Shop rerolls are disabled.',
  ch_no_rest_name:     'Relentless March',
  ch_no_rest_desc:     'Rest Site nodes cannot be used.',
  ch_perfect_nexus_name: 'Perfect Defense',
  ch_perfect_nexus_desc: 'Any Nexus hit ends the run immediately.',
  ch_auto_shop_name:   'Fate\'s Path',
  ch_auto_shop_desc:   'No node selection — always enter the Shop after a wave.',
  ch_no_event_name:    'Orderly Run',
  ch_no_event_desc:    'Event nodes cannot be selected.',

  challenge_tower_banned:  'Challenge: that tower type is restricted.',
  challenge_card_banned:   (type) => `Challenge: ${type} cards are restricted.`,
  challenge_no_reroll:     'Reroll disabled (Challenge)',
  challenge_no_buy:        '🚫 Restricted',
  challenge_node_banned:   '🚫 Restricted by Challenge',
  challenge_perfect_fail:  '💎 Perfect Defense failed — Nexus was hit!',

  // ── How to Play ──────────────────────────────────────
  howto_title:    'How to Play',
  howto_close:    'Got it!',
  howto_1:        '<b>Summon cards</b> — Click card, then click an empty hex to place a tower.',
  howto_2:        '<b>Augment cards</b> — Click card, then click an existing tower to upgrade it.',
  howto_3:        '<b>Spell cards</b> — Click card to activate instantly.',
  howto_4:        'Towers attack enemies automatically. Don\'t let them reach the exit!',
  howto_5:        'You have <b>Nexus HP</b>. Lose them all and the run ends.',
  howto_6:        '⚡ <b>Enrage</b> — Some enemies (Berserker, Void Stalker, Colossus) <b>speed up dramatically</b> at low HP. Burst them down fast!',
  howto_7:        '🛡️ <b>Damage Reduction</b> — Plague Carriers and Phantoms take less damage. Use many towers, not just one big one.',
  howto_8:        '🧊 <b>Slow Immunity</b> — Juggernauts, Siege Beasts, and Stone Golems <b>cannot be slowed</b>. Focus raw damage.',

  howto_shortcuts_title: '⌨️ Keyboard Shortcuts',
  howto_shortcuts_body:  `
    <div class="shortcut-grid">
      <div class="sc-row"><kbd>Space</kbd><span>Start Wave</span></div>
      <div class="sc-row"><kbd>1</kbd>–<kbd>5</kbd><span>Select / play card</span></div>
      <div class="sc-row"><kbd>F</kbd><span>Deselect card</span></div>
      <div class="sc-row"><kbd>Tab</kbd><span>2× Speed toggle (wave only)</span></div>
      <div class="sc-row"><kbd>Esc</kbd><span>Pause / Close overlay</span></div>
      <div class="sc-row"><kbd>1</kbd>–<kbd>3</kbd><span>Node · Shop · Event choice</span></div>
      <div class="sc-row"><kbd>R</kbd><span>Reroll shop / Retry</span></div>
      <div class="sc-row"><kbd>L</kbd><span>Leave shop</span></div>
      <div class="sc-row"><kbd>M</kbd><span>Mute (while paused)</span></div>
      <div class="sc-row"><kbd>Q</kbd><span>Quit to menu (while paused)</span></div>
    </div>`,

  // ── 게임 오버 / 승리 ─────────────────────────────────
  gameover_title_win:  '🏆 Victory!',
  gameover_title_lose: 'Run Over',
  gameover_win_msg:    (waves) => `You cleared ${waves} waves. The Nexus stands!`,
  gameover_lose_msg:   (waves) => `You reached Wave ${waves} before the Nexus fell.`,
  btn_play_again:      'Play Again',
  btn_main_menu:       'Main Menu',

  // ── 런 로그 메시지 ───────────────────────────────────
  log_run_start:    (warden) => `${warden} — A new run begins!`,
  log_wave_start:   (n, act)  => `Wave ${n} started! (Act ${act})`,
  log_wave_clear:   (n, gold) => `Wave ${n} cleared! +${gold} gold`,
  log_boss_wave:    (name)    => `⚠️ BOSS WAVE! ${name} approaches!`,
  log_victory_streak_start: (n) => `✨ Boss slain! Victory bonus for next ${n} waves.`,
  log_victory_streak:       (g, n) => n > 0 ? `✨ Victory bonus: +${g}g (${n} wave${n > 1 ? 's' : ''} remaining)` : `✨ Victory bonus: +${g}g`,
  log_nexus_hit:    (hp)      => `An enemy reached the Nexus! (${hp} HP left)`,
  log_card_placed:  (name, c, r) => `Placed ${name} at (${c},${r})`,
  log_not_enough_gold: (need, have) => `Not enough gold! (need ${need}, have ${have})`,

  // ── 카드 타입 ────────────────────────────────────────
  card_type_summon:  'summon',
  card_type_augment: 'augment',
  card_type_spell:   'spell',
  card_type_curse:   'CURSE',
  card_surcharge:    '+1 surcharge',
  card_free:         'FREE',

  // ── Balance Sync #10: 저주 카드 + Cursed Wave + 엔레이지 경보 ─
  log_curse_unplayable:   'Curse cards cannot be played.',
  log_curse_regret:       (name) => `Regret discards ${name}!`,
  log_cursed_bargain:     '💀 A dark pact corrupts your deck…',
  log_cursed_wave_speed:  '⚠️ Cursed Wave: Enemies move 35% faster!',
  log_cursed_wave_hand:   '⚠️ Cursed Wave: Hand size reduced by 2 this wave!',
  log_cursed_wave_revive: '⚠️ Cursed Wave: Elites will revive at 30% HP!',
  log_enrage_imminent:    (name) => `⚠️ ${name}: Enrage imminent!`,

  // ── 노드 선택 (추가) ────────────────────────────────
  node_after_wave:     (n) => `— After Wave ${n} —`,
  node_gold_display:   (g) => `💰 ${g} gold`,
  node_merchant:       'MERCHANT',
  node_unknown:        'UNKNOWN',
  node_sanctuary:      'SANCTUARY',
  node_shop_desc2:     'Browse and buy cards for your deck. Reroll twice.',
  node_event_desc2:    'A random encounter offers a tough choice.',
  node_rest_desc2:     'Trim your deck or recover resources.',

  // ── 휴식 (추가) ─────────────────────────────────────
  rest_site:           'Rest Site',
  rest_subtitle2:      'Take a moment to recover or refine your deck.',
  rest_remove_card:    'Remove a Card',
  rest_remove_desc:    'Permanently remove one card from your deck (free).',
  rest_scavenge:       'Scavenge',
  rest_scavenge_desc:  (g) => `Search the area for supplies. Gain ${g} gold.`,
  rest_choose_card:    'Choose a card to remove:',
  rest_cancel:         'Cancel',
  rest_leave:          'Leave →',
  rest_deck_empty:     'Deck is empty!',
  rest_scavenged:      (g) => `Scavenged the area. +${g} gold.`,
  card_btn_remove:     'Remove',
  event_log:           (title, label) => `[${title}] ${label}`,

  // ── 런 요약 ─────────────────────────────────────────
  summary_victory:        'Victory!',
  summary_defeat:         'Nexus Fallen',
  summary_victory_sub:    'The Warden holds!',
  summary_defeat_sub:     (n) => `Fell on Wave ${n}`,
  stat_waves_cleared:     'Waves Cleared',
  stat_enemies_slain:     'Enemies Slain',
  stat_gold_earned:       'Gold Earned',
  stat_cards_played:      'Cards Played',
  rank_label:             'Warden Rank',
  xp_gained:              (n) => `+${n} XP`,
  rank_num:               (n) => `Rank ${n}`,
  max_rank:               'MAX RANK',
  lifetime_runs:          (n) => `Total Runs: ${n}`,
  lifetime_wins:          (n) => `Wins: ${n}`,
  lifetime_kills:         (n) => `Total Kills: ${n}`,
  unlock_label:           (title, rank) => `🔓 ${title}  Rank ${rank}`,

  // ── Codex ────────────────────────────────────────────
  codex_max_rank:         'MAX RANK REACHED',
  codex_xp_to:            (xp, rank) => `${xp} XP to Rank ${rank}`,
  codex_stat_runs:        'Runs',
  codex_stat_wins:        'Wins',
  codex_stat_slain:       'Enemies Slain',
  codex_stat_winrate:     'Win Rate',
  codex_unlocked:         (rank) => `✓ Rank ${rank}`,
  codex_locked:           (rank) => `Rank ${rank} required`,

  // ── 게임 인게임 로그 (추가) ──────────────────────────
  log_tutorial_done:      "Tutorial complete! You're ready, Warden.",
  log_select_summon:      (name) => `Selected: ${name}. Click an empty hex on the map.`,
  log_select_augment:     (name) => `Selected: ${name}. Click a tower on the map.`,
  log_cannot_place:       'Cannot place here.',
  log_tower_exists:       'A tower is already here.',
  log_no_tower:           'No tower here to augment.',
  log_max_augments:       'Tower already has max augments.',
  log_nexus_healed:       (hp) => `Nexus HP restored! (${hp} HP remaining)`,
  log_nexus_full:         'Nexus is already at full HP.',
  log_no_targets:         'No targets for Chain Bolt.',
  log_prepare_wave:       (n) => `Prepare for Wave ${n}!`,
  log_shop_closed:        'Shop closed.',
  log_run_begin:          'A new run begins. Draw cards and place towers!',
  log_surcharge:          (cost, extra) => extra > 1
    ? `+${extra}g wave surcharge (Ascension III). Need ${cost} gold.`
    : `+1 gold surcharge during wave. Need ${cost} gold.`,
  log_nexus_cursed:       (hp) => `Nexus damaged! ${hp} HP remaining.`,
  log_cards_added:        (n, r) => `Added ${n} ${r} card(s) to your deck.`,
  log_wave_slow:          'Next wave enemies will be slower.',
  log_extra_prep:         (s) => `+${s}s preparation time next wave.`,
  log_card_removed_rand:  (name) => `Removed ${name} from deck.`,
  log_nothing:            'Nothing happened. Sometimes caution is wisdom.',
  log_augmented:          (stat, mult) => `Tower augmented: ${stat} ×${mult}`,

  // ── 주문 로그 ────────────────────────────────────────
  spell_gold:             (n) => `+${n} gold!`,
  spell_freeze:           'Blizzard! All enemies frozen.',
  spell_damage_all:       (n) => `${n} damage to all enemies!`,
  spell_slow_all:         (pct, s) => `Earthquake! All enemies slowed ${pct}% for ${s}s.`,
  spell_lightning:        (count, n) => `Lightning strikes ${count} random enemies for ${n} damage!`,
  spell_chain_bolt_hit:   (d, c, cd) => `Chain Bolt! ${d} + ${cd}×${c} chain damage.`,
  spell_chain_bolt_miss:  'No targets for Chain Bolt.',
  spell_nexus_heal:       "Nature's Mercy! Nexus HP restored.",
  spell_draw:             (n) => `Mana Surge! Drew ${n} extra cards.`,
  spell_speed_boost:      (mult, s) => `Time Warp! All towers attacking ×${mult} speed for ${s}s!`,
  spell_dmg_boost:        (mult, s) => `Power Surge! All towers dealing ×${mult} damage for ${s}s!`,
  spell_nova:             (d, pct, s) => `Arcane Nova! ${d} damage + ${pct}% slow to all enemies!`,
  spell_gold_draw:        (g, n) => `Salvage! +${g} gold and drew ${n} card(s).`,
  spell_tower_rally:      'Tower Rally! All towers fire immediately!',
  spell_soul_harvest:     (n) => `Soul Harvest! +${n} gold from ${n} enemies.`,
  spell_no_enemies:       'No enemies on the field.',
  spell_nature_cycle:     "Nature's Cycle! Hand refreshed — 5 new cards drawn.",
  spell_rally_cry:        (pct, s) => `Rally Cry! All towers +${pct}% damage and 60% faster for ${s}s!`,
  spell_ice_storm:        (d, pct, s) => `Ice Storm! ${d} damage + ${pct}% slow to all enemies for ${s}s!`,
  spell_void_bolt:        (d) => `Void Bolt! ${d} damage to the lead enemy.`,
  spell_crimson_tide:     (d) => `Crimson Tide! ${d} damage to all enemies!`,
  spell_arcane_storm:     (n, d) => `Arcane Storm! ${d} damage to ${n} enemies!`,
  spell_mass_slow:        (pct, s) => `Quagmire! All enemies slowed ${pct}% for ${s}s.`,
  spell_overdrive:        (s) => `Overdrive! All towers attacking 3× speed for ${s}s!`,
  spell_needle:           (d) => `Needle Bolt! ${d} damage to the lead enemy.`,
  spell_chain_storm:      (n, d) => `Chain Storm! ${d} damage to ${n} enemies!`,
  spell_warden_call:      (n) => `Warden's Call! Drew ${n} cards.`,
  spell_time_stop:        (s) => `Time Stop! All enemies frozen for ${s} seconds!`,
  spell_cryowave:         (d, s) => `Cryo Wave! ${d} damage + all enemies frozen for ${s}s!`,
  spell_void_rift:        'Void Rift! All enemies teleported back to spawn!',
  spell_ember_rain:       (d, pct, s) => `Ember Rain! ${d} damage + ${pct}% slow to all enemies!`,
  spell_life_tap:         (g, n) => `Life Tap! +${g} gold and drew ${n} cards.`,

  // ── v1.2 Shadow Warden 스펠 로그 ─────────────────────
  spell_soul_drain:       (d, k) => k > 0 ? `Soul Drain! ${d} damage dealt. ${k} kills → +${k} gold!` : `Soul Drain! ${d} damage to all enemies.`,
  spell_grave_call:       (n) => `Grave Call! Recovered ${n} card${n !== 1 ? 's' : ''} from the discard pile.`,
  spell_entropy:          (pct, total) => `Entropy! Dealt ${pct}% current HP as damage — ${total} total damage!`,
  spell_dark_matter:      (d) => `Dark Matter! ${d} damage to the toughest enemy!`,
  spell_void_echo:        (type) => `Void Echo! Repeating: ${type}.`,
  spell_void_echo_empty:  'Void Echo: No spell to repeat yet.',
  spell_sacrifice:        (n, g) => n > 0 ? `Dark Sacrifice! Discarded ${n} card${n !== 1 ? 's' : ''} → +${g} gold.` : 'Dark Sacrifice! Hand was already empty.',
  spell_no_discard:       'Discard pile is empty — nothing to recover.',
  spell_decay:            (pct, s) => `Decay! All enemies slowed ${pct}% for ${s} seconds.`,

  // ── 카드 핸드 ────────────────────────────────────────
  hand_label:             'HAND',
  hand_empty:             'No cards in hand.',
  card_surcharge_label:   '+1 surcharge',

  // ── 배너 ─────────────────────────────────────────────
  banner_boss_act:        (act) => `ACT ${act} — BOSS WAVE`,
  banner_boss_ironclad:   'IRONCLAD APPROACHES!',
  banner_boss_titan:      'VOID TITAN AWAKENS!',
  banner_boss_dragon:     'ABYSSAL DRAGON DESCENDS!',
  banner_act_clear:       (act) => `✨ ACT ${act} COMPLETE ✨`,
  banner_act_next:        (act) => `PREPARE FOR ACT ${act}`,
  banner_victory:         '🏆 VICTORY! 🏆',
  banner_all_clear:       'ALL ACTS COMPLETE',
  banner_wave_clear:      (n) => `Wave ${n} Cleared!`,
  banner_entering_shop:   'ENTERING SHOP',
  banner_unlock:          '🔓',

  // ── 유물 시스템 ──────────────────────────────────────
  relic_pick_title:     'Choose a Relic',
  relic_pick_sub:       'Your chosen relic persists for the entire run.',
  rarity_common:        'Common',
  rarity_uncommon:      'Uncommon',
  rarity_rare:          'Rare',

  // 유물 이름 & 설명
  relic_whetstone:              'Whetstone',
  relic_whetstone_desc:         'Archer Towers deal +30% damage.',
  relic_blast_powder:           'Blast Powder',
  relic_blast_powder_desc:      'Cannon Towers have +40% splash range.',
  relic_ember_core:             'Ember Core',
  relic_ember_core_desc:        'Fire Drake burn deals +4 DPS and lasts 0.8s longer.',
  relic_static_coil:            'Static Coil',
  relic_static_coil_desc:       'Tesla Coil chains to 1 additional enemy.',
  relic_ancient_bark:           'Ancient Bark',
  relic_ancient_bark_desc:      "Druid Grove's aura grants +10% extra damage (total +25%).",
  relic_merchants_badge:        "Merchant's Badge",
  relic_merchants_badge_desc:   'Gain +3 gold each time you clear a wave.',
  relic_gold_lens:              'Gold Lens',
  relic_gold_lens_desc:         'All shop cards cost 1 less gold (min 1).',
  relic_lucky_coin:             'Lucky Coin',
  relic_lucky_coin_desc:        'Earn interest when you have 5+ gold (instead of 10+).',
  relic_war_chest:              'War Chest',
  relic_war_chest_desc:         'Start the run with +10 extra gold.',
  relic_bounty_mark:            'Bounty Mark',
  relic_bounty_mark_desc:       'Every enemy kill rewards +1 extra gold.',
  relic_aegis_fragment:         'Aegis Fragment',
  relic_aegis_fragment_desc:    'Start with 1 extra Nexus HP.',
  relic_soul_anchor:            'Soul Anchor',
  relic_soul_anchor_desc:       'The first enemy to reach the Nexus deals no damage. (Once per run)',
  relic_frost_ward:             'Frost Ward',
  relic_frost_ward_desc:        'All slow effects are 25% stronger.',
  relic_swift_quiver:           'Swift Quiver',
  relic_swift_quiver_desc:      'Draw 1 extra card at the start of each wave.',
  relic_arcane_focus:           'Arcane Focus',
  relic_arcane_focus_desc:      'Tesla Coil attacks 25% faster.',

  // 유물 이름 & 설명 (신규 10개)
  relic_venom_fang:             'Venom Fang',
  relic_venom_fang_desc:        'Enemy kills deal 15 poison damage to a random nearby enemy.',
  relic_siege_engine:           'Siege Engine',
  relic_siege_engine_desc:      'Cannon towers have +60% splash radius.',
  relic_merchants_ring:         "Merchant's Ring",
  relic_merchants_ring_desc:    'The first reroll in each shop visit is free.',
  relic_savings_bond:           'Savings Bond',
  relic_savings_bond_desc:      'Earn +2 extra gold each time interest triggers.',
  relic_iron_fortress:          'Iron Fortress',
  relic_iron_fortress_desc:     'The Nexus can only be damaged once per wave.',
  relic_thorn_wall:             'Thorn Wall',
  relic_thorn_wall_desc:        'When the Nexus is hit, deal 25 damage to the nearest enemy.',
  relic_fire_pact:              'Fire Pact',
  relic_fire_pact_desc:         'When 2+ Fire Drake towers are active, they deal +25% bonus damage.',
  relic_storm_circuit:          'Storm Circuit',
  relic_storm_circuit_desc:     'After casting any spell, all Tesla Coils fire immediately.',
  relic_wardens_sigil:          "Warden's Sigil",
  relic_wardens_sigil_desc:     'After clearing each wave, draw 2 extra cards into your hand.',
  relic_blood_price:            'Blood Price',
  relic_blood_price_desc:       'Sacrifice 1 Nexus HP to gain +20 gold immediately.',

  // 유물 로그 메시지
  log_relic_picked:     (name) => `Relic acquired: ${name}`,
  log_soul_anchor:      'Soul Anchor absorbed the hit! Nexus protected.',
  log_interest:         (n) => `Interest: +${n} gold.`,
  log_iron_fortress:    'Iron Fortress! Nexus shielded — no further hits this wave.',
  log_thorn_wall:       (dmg) => `Thorn Wall! ${dmg} damage reflected to the nearest enemy.`,
  log_venom_fang:       (dmg) => `Venom Fang! ${dmg} poison damage to a nearby enemy.`,
  log_wave_draw:        (n) => `Warden's Sigil! Drew ${n} extra cards.`,
  log_storm_circuit:    (n) => `Storm Circuit! ${n} Tesla Coil(s) fired!`,
  log_blood_price:      (g) => `Blood Price: Sacrificed 1 Nexus HP for +${g} gold.`,
  log_savings_bond:     (n) => `Savings Bond: +${n} bonus interest gold.`,
  log_free_reroll:      'Free reroll! (Merchant\'s Ring)',

  // ── 난이도 ────────────────────────────────────────────
  difficulty_title:     'Choose Difficulty',
  difficulty_sub:       'Select how challenging this run will be.',
  diff_novice:          'Novice',
  diff_standard:        'Standard',
  diff_veteran:         'Veteran',
  diff_novice_desc:     '5 Nexus HP · Slower scaling · +5 gold start · +1g wave rewards',
  diff_standard_desc:   '3 Nexus HP · Balanced challenge · Default settings',
  diff_veteran_desc:    '2 Nexus HP · Faster scaling · Less gold · Elite enemies are tougher',
  diff_confirm:         '▶ Begin Run',
  diff_back:            '← Back',
  log_difficulty:       (name) => `Difficulty: ${name}`,

  // ── 노드 힌트 뱃지 ───────────────────────────────────
  node_hint_economy:  'Economy',
  node_hint_mystery:  'Mystery',
  node_hint_rest:     'Recovery',

  // ── 자동저장 ─────────────────────────────────────────
  btn_continue:       (wave, icon, map) => `↩ Continue — ${icon} ${map} (Wave ${wave})`,
  autosave_loaded:    (wave) => `Run restored from Wave ${wave}. Good luck, Warden!`,

  // ── 워든 패시브 설명 ──────────────────────────────────
  passive_stalwart_desc:    'No special effect. Fully benefits from meta bonuses.',
  passive_bloodlust_desc:   '+1 gold per kill. (Tank +1, Elite +1, Boss +5)',
  passive_arcane_flow_desc: 'All spell costs -1 (min 0). Wave surcharge also -1.',
  passive_grave_gold_desc:  'At wave start, gain 1 gold per card discarded from hand.',
  passive_grave_gold_trigger: (n) => `Grave Gold: +${n} gold from discarded cards.`,

  // ── 공통 ─────────────────────────────────────────────
  free:              'FREE',
  gold_unit:         'g',
  loading:           'Loading...',
  version:           (v) => `v${v}`,

  // ── Ascension Mode ───────────────────────────────────
  asc_section_title:  '⚡ Ascension Mode',
  asc_section_sub:    'Rank 20 achieved. Layer additional challenges on top of your difficulty.',
  asc_off:            'Off',
  asc_off_desc:       'Standard rules. No additional handicaps.',
  asc_1_title:        'Ascension I',
  asc_1_desc:         'Shop displays only 2 cards per visit.',
  asc_2_title:        'Ascension II',
  asc_2_desc:         'No interest. Gold must be spent to grow.',
  asc_3_title:        'Ascension III',
  asc_3_desc:         'Wave surcharge increased to +2 gold per card.',
  asc_locked:         (n) => `Clear Ascension ${n - 1} to unlock`,
  asc_cleared:        (n) => `🏆 Ascension ${n} cleared! New level unlocked.`,
  asc_new_record:     (n) => `🔓 Ascension ${n} unlocked!`,
  log_ascension:      (n) => `Ascension ${n} active — good luck, Warden.`,
  log_asc_cleared:    (n) => `Ascension ${n} complete! Ascension ${n + 1} is now unlocked.`,
  log_asc_all_clear:  'All Ascension levels conquered! You are the ultimate Warden.',

  // ── 튜토리얼 ─────────────────────────────────────────
  tut_welcome_title: 'Welcome, Warden!',
  tut_welcome_text:  'You must defend the Nexus from waves of enemies.\n\nUse <b>cards</b> to summon towers, then survive all 3 waves.',
  tut_welcome_btn:   "Let's go!",
  tut_path_title:    'The Enemy Path',
  tut_path_text:     'Enemies march along the <b style="color:#ff8888">red highlighted path</b> from SPAWN to EXIT.\n\nYour Nexus has ♥♥♥. If 3 enemies reach the exit — it\'s over.',
  tut_path_btn:      'Got it',
  tut_green_title:   'Best Tower Spots',
  tut_green_text:    'See the <b style="color:#4caf50">green-tinted cells</b>? Those are adjacent to the path.\n\n<b>Place towers there</b> for maximum coverage!',
  tut_green_btn:     'Got it',
  tut_select_title:  'Select a Card',
  tut_select_text:   'Click the <b>🏹 Archer Tower</b> card to select it.\n\nThe card will glow gold when selected.',
  tut_place_title:   'Place the Tower',
  tut_place_text:    'Now click a <b style="color:#4caf50">green cell</b> on the map to place your Archer Tower.',
  tut_wave_title:    'Start the Wave!',
  tut_wave_text:     'Great! Place more towers if you have gold, then click <b>Start Wave</b>.',
  tut_combat_title:  'Towers Attack!',
  tut_combat_text:   'Your towers attack enemies <b>automatically</b>.\n\nWatch the combat — enemies have HP bars and die with particle effects!',
  tut_combat_btn:    'Cool!',
  tut_hud_title:     'Track Your Status',
  tut_hud_text:      '<b>WAVE</b> — current / total waves\n<b>GOLD</b> — spend on cards & upgrades\n<b>NEXUS ♥♥♥</b> — lose all 3 and it\'s over',
  tut_hud_btn:       'Got it',
  tut_done_title:    "🏆 You're Ready, Warden!",
  tut_done_text:     'After clearing a wave, choose your path:\n• <b>🏪 Shop</b> — buy new cards\n• <b>⚡ Event</b> — random choices\n• <b>🛌 Rest</b> — remove cards or get gold\n\nGood luck. The Nexus needs you.',
  tut_done_btn:      'Begin!',
  tut_waiting:        'Waiting for your action…',
  tut_manual_advance: 'Continue manually',
  tut_skip:           'Skip Tutorial',
  tut_hint_select:   'Tutorial: Select an Archer Tower card from your hand.',
  tut_hint_place:    'Tutorial: Click a green cell near the path.',
  tut_hint_wave:     'Tutorial: Click Start Wave when ready!',

  // ── 런 요약 (맵·난이도 표시) ────────────────────────
  summary_map:       'Map',
  summary_difficulty:'Difficulty',

  // ── 이벤트 데이터 (번역됨) ────────────────────────────
  events: [
    {
      id: 'merchants_gift', title: "Merchant's Gift", icon: '🎁',
      flavor: 'A travelling merchant offers his surplus.',
      choices: [
        { label: 'Take Gold',  desc: '+10 gold',                        effect: { type: 'gold', amount: 10 } },
        { label: 'Take Cards', desc: 'Add 2 random Common cards to your deck', effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
    },
    {
      id: 'ancient_tome', title: 'Ancient Tome', icon: '📖',
      flavor: 'Pages filled with forgotten spells glow faintly.',
      choices: [
        { label: 'Study It', desc: 'Add a random Rare card to your deck', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Sell It',  desc: '+12 gold',                           effect: { type: 'gold', amount: 12 } },
      ],
    },
    {
      id: 'cursed_relic', title: 'Cursed Relic', icon: '💀',
      flavor: 'Power comes at a cost. Always.',
      choices: [
        { label: 'Accept the Curse', desc: '+18 gold, lose 1 Nexus HP', effect: { type: 'cursed_gold', amount: 18, nexusDmg: 1 } },
        { label: 'Leave It',         desc: 'Nothing happens',           effect: { type: 'nothing' } },
      ],
    },
    {
      id: 'mysterious_fog', title: 'Mysterious Fog', icon: '🌫️',
      flavor: 'The air grows thick. Enemies stumble in the mist.',
      choices: [
        { label: 'Embrace the Fog', desc: 'Next wave enemies -25% speed', effect: { type: 'slow_next_wave', amount: 0.25 } },
        { label: 'Burn it Away',    desc: '+6 gold',                      effect: { type: 'gold', amount: 6 } },
      ],
    },
    {
      id: 'fallen_knight', title: 'Fallen Knight', icon: '⚔️',
      flavor: "A warrior's final gift lies on the battlefield.",
      choices: [
        { label: 'Take the Sword',  desc: 'Add a random Uncommon card', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
        { label: 'Take the Shield', desc: '+8 gold',                    effect: { type: 'gold', amount: 8 } },
      ],
    },
    {
      id: 'war_cache', title: 'War Cache', icon: '📦',
      flavor: 'A buried chest, untouched since the last siege.',
      choices: [
        { label: 'Take Gold',     desc: '+15 gold',                  effect: { type: 'gold', amount: 15 } },
        { label: 'Take Supplies', desc: 'Add 3 random Common cards', effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'warden_blessing', title: "Warden's Blessing", icon: '✨',
      flavor: 'The spirits of past Wardens watch over you.',
      choices: [
        { label: 'Bless the Deck',   desc: 'Add 1 random Uncommon card', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
        { label: 'Bless the Vaults', desc: '+10 gold',                   effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'ravens_secret', title: "Raven's Secret", icon: '🪶',
      flavor: 'The raven whispers something about your enemies.',
      choices: [
        { label: 'Listen Closely', desc: 'Next wave +5 sec prep time', effect: { type: 'extra_prep', seconds: 5 } },
        { label: 'Ignore It',      desc: '+4 gold',                    effect: { type: 'gold', amount: 4 } },
      ],
    },
    {
      id: 'storm_of_blades', title: 'Storm of Blades', icon: '🌀',
      flavor: 'A swirling vortex of magical weapons hovers nearby.',
      choices: [
        { label: 'Grab a Blade',   desc: 'Add 1 random Rare card', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Sell for Parts', desc: '+14 gold',               effect: { type: 'gold', amount: 14 } },
      ],
    },
    {
      id: 'dark_bargain', title: 'Dark Bargain', icon: '🕯️',
      flavor: 'A shadowy figure offers a deal. Is it worth the risk?',
      choices: [
        { label: 'Bargain', desc: 'Remove 1 random card → +20 gold', effect: { type: 'remove_random_add_gold', amount: 20 } },
        { label: 'Decline', desc: '+5 gold',                         effect: { type: 'gold', amount: 5 } },
      ],
    },
    // ── 신규 이벤트 10종 ──────────────────────────────────
    {
      id: 'wandering_healer', title: 'Wandering Healer', icon: '💉',
      flavor: 'A field medic tends to the wounded, including the Nexus.',
      choices: [
        { label: 'Heal the Nexus', desc: 'Restore 1 Nexus HP',   effect: { type: 'heal_nexus', amount: 1 } },
        { label: 'Take Supplies',  desc: '+8 gold',               effect: { type: 'gold', amount: 8 } },
      ],
    },
    {
      id: 'lost_armory', title: 'Lost Armory', icon: '⚔️',
      flavor: 'Weapons of unknown soldiers, left behind after a fierce battle.',
      choices: [
        { label: 'Arm Yourself',   desc: 'Add 2 random Uncommon cards', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Sell the Metal', desc: '+15 gold',                    effect: { type: 'gold', amount: 15 } },
      ],
    },
    {
      id: 'arcane_surge', title: 'Arcane Surge', icon: '✨',
      flavor: 'Wild magic crackles through the air, bending fate.',
      choices: [
        { label: 'Harness It', desc: 'Add 1 random Rare card to your deck', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Resist It',  desc: '+10 gold',                            effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'spectral_cache', title: 'Spectral Cache', icon: '👻',
      flavor: 'A ghostly vault materialises. Its contents shimmer and fade.',
      choices: [
        { label: 'Plunder It',  desc: 'Remove 1 random card → +25 gold', effect: { type: 'remove_random_add_gold', amount: 25 } },
        { label: 'Leave It',    desc: '+10 gold',                        effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'sentinel_rest', title: "Sentinel's Respite", icon: '🏕️',
      flavor: 'A lull in the assault. Use it wisely.',
      choices: [
        { label: 'Fortify', desc: '+8 sec preparation time next wave', effect: { type: 'extra_prep', seconds: 8 } },
        { label: 'Rest',    desc: '+7 gold',                          effect: { type: 'gold', amount: 7 } },
      ],
    },
    {
      id: 'warden_memory', title: "Warden's Memory", icon: '🪬',
      flavor: 'Ancient techniques surface from the depths of your training.',
      choices: [
        { label: 'Recall Power',   desc: 'Add 1 Rare card',         effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Recall Tactics', desc: 'Add 2 Uncommon cards',    effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
    },
    {
      id: 'void_shard', title: 'Void Shard', icon: '🔮',
      flavor: 'A fragment of the void throbs with dark power.',
      choices: [
        { label: 'Absorb It',  desc: '+18 gold, lose 1 Nexus HP', effect: { type: 'cursed_gold', amount: 18, nexusDmg: 1 } },
        { label: 'Discard It', desc: 'Next wave enemies -20% speed', effect: { type: 'slow_next_wave', amount: 0.20 } },
      ],
    },
    {
      id: 'supply_drop', title: 'Supply Drop', icon: '📦',
      flavor: 'Allied forces send reinforcements from the rear.',
      choices: [
        { label: 'Take Gold',     desc: '+18 gold',               effect: { type: 'gold', amount: 18 } },
        { label: 'Take Cards',    desc: 'Add 3 random Common cards', effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'ember_relic', title: 'Ember Relic', icon: '🔥',
      flavor: 'Warm to the touch. Radiates an ancient combat blessing.',
      choices: [
        { label: 'Wield It', desc: 'Add 2 random Uncommon cards', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Sell It',  desc: '+16 gold',                   effect: { type: 'gold', amount: 16 } },
      ],
    },
    {
      id: 'frozen_vault', title: 'Frozen Vault', icon: '❄️',
      flavor: 'Encased in ice for centuries. Its treasures are perfectly preserved.',
      choices: [
        { label: 'Thaw It',      desc: 'Add 1 Rare card to your deck', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Sell the Ice', desc: '+12 gold',                     effect: { type: 'gold', amount: 12 } },
      ],
    },
    // ── 신규 이벤트 10종 (Wave 21-30용) ──────────────────
    {
      id: 'elite_ambush', title: 'Elite Ambush', icon: '🗡️',
      flavor: 'Scouts report elite vanguards moving ahead of schedule.',
      choices: [
        { label: 'Set a Trap',      desc: 'Next wave enemies -30% speed',  effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: 'Claim the Kill',  desc: 'Add 1 Rare card to your deck',  effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
    },
    {
      id: 'tower_blessing', title: 'Tower Blessing', icon: '🌟',
      flavor: 'Arcane energy surges through your fortifications.',
      choices: [
        { label: 'Infuse the Towers', desc: 'Add 2 Uncommon cards to your deck', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Absorb the Power',  desc: '+14 gold',                          effect: { type: 'gold', amount: 14 } },
      ],
    },
    {
      id: 'gold_fever', title: 'Gold Fever', icon: '💸',
      flavor: "Riches lie buried beneath the battlefield's soil.",
      choices: [
        { label: 'Mine Deep',  desc: '+22 gold',                          effect: { type: 'gold', amount: 22 } },
        { label: 'Mine Fast',  desc: 'Add 2 Common cards to your deck',   effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
    },
    {
      id: 'debt_collector', title: 'Debt Collector', icon: '💼',
      flavor: 'A desperate merchant begs for a short-term loan — with interest.',
      choices: [
        { label: 'Lend the Gold',   desc: 'Spend 10g → gain 26g (net +16g)', effect: { type: 'spend_for_gold', spend: 10, gain: 26 } },
        { label: 'Turn Them Away',  desc: '+4 gold (finder\'s fee)',          effect: { type: 'gold', amount: 4 } },
      ],
    },
    {
      id: 'relic_merchant', title: 'Relic Merchant', icon: '🧿',
      flavor: 'A hooded figure trades in forgotten artifacts and forbidden power.',
      choices: [
        { label: 'Buy Rare Knowledge', desc: 'Add 1 Rare card to your deck',        effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Buy Common Wares',   desc: 'Add 3 Common cards to your deck',     effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'wardens_duel', title: "Warden's Duel", icon: '🏆',
      flavor: 'A rival Warden challenges your reputation on the battlefield.',
      choices: [
        { label: 'Accept the Challenge', desc: 'Add 1 Rare card to your deck',     effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Negotiate a Treaty',   desc: 'Add 2 Uncommon cards to your deck', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
    },
    {
      id: 'haunted_ground', title: 'Haunted Ground', icon: '🪦',
      flavor: 'The spirits of the fallen linger, whispering warnings.',
      choices: [
        { label: 'Commune with Spirits', desc: '+10 sec preparation time next wave', effect: { type: 'extra_prep', seconds: 10 } },
        { label: 'Banish the Spirits',   desc: 'Add 1 Rare card to your deck',       effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
    },
    {
      id: 'ancient_shrine', title: 'Ancient Shrine', icon: '⛩️',
      flavor: 'A shrine to forgotten war gods stands untouched on the path.',
      choices: [
        { label: 'Pray for Guidance', desc: 'Add 2 Uncommon cards to your deck', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Desecrate It',      desc: '+15 gold',                          effect: { type: 'gold', amount: 15 } },
      ],
    },
    {
      id: 'war_horn', title: 'War Horn', icon: '📯',
      flavor: 'A distant horn sounds — reinforcements are marching.',
      choices: [
        { label: 'Rally the Troops', desc: '+8 sec preparation time next wave', effect: { type: 'extra_prep', seconds: 8 } },
        { label: 'Sell the Horn',    desc: '+10 gold',                          effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'plague_doctor', title: 'Plague Doctor', icon: '🧪',
      flavor: 'A masked physician offers experimental Nexus treatments.',
      choices: [
        { label: 'Accept Treatment', desc: 'Spend 8g → restore 1 Nexus HP', effect: { type: 'heal_nexus_cost', amount: 1, cost: 8 } },
        { label: 'Decline',          desc: '+5 gold',                        effect: { type: 'gold', amount: 5 } },
      ],
    },
  ],
};

// DLC 번역 병합
export default { ..._BASE_EN, ...dlcShadowEn, ...dlcSolarEn };
