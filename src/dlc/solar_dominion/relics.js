/**
 * Solar Dominion DLC — 유물 (15개)
 * Solar / Holy / Light 테마
 */

export const SOLAR_RELICS = [

  // ── 공격형 (5) ──────────────────────────────────────
  {
    id: 'solar_lens',
    icon: '🔆', rarity: 'uncommon', category: 'attack',
    // Divine Cannon 사거리 +60%
    effect: { type: 'tower_range_bonus', towerType: 'divine_cannon', mult: 1.60 },
    dlc: 'solar_dominion',
  },
  {
    id: 'titan_bane',
    icon: '⚔️', rarity: 'rare', category: 'attack',
    // Solar Scythe HP 500+ 피해 보너스 +30%p 추가 (50% → 80%)
    effect: { type: 'solar_dot_bonus', extraDps: 4, extraDuration: 1500 },
    dlc: 'solar_dominion',
  },
  {
    id: 'radiant_core',
    icon: '✨', rarity: 'uncommon', category: 'attack',
    // 모든 타워 피해 +12%
    effect: { type: 'tower_dmg_bonus', towerType: '__all__', mult: 1.12 },
    dlc: 'solar_dominion',
  },
  {
    id: 'solar_capacitor',
    icon: '⚡', rarity: 'rare', category: 'attack',
    // 모든 타워 공격속도 +20%
    effect: { type: 'tower_speed_bonus', towerType: '__all__', mult: 0.80 },
    dlc: 'solar_dominion',
  },
  {
    id: 'crusader_relic',
    icon: '🏺', rarity: 'uncommon', category: 'attack',
    // Crusader 스턴 지속 +200ms
    effect: { type: 'crusader_stun_bonus', extraMs: 200 },
    dlc: 'solar_dominion',
  },

  // ── 경제형 (3) ──────────────────────────────────────
  {
    id: 'solar_tribute',
    icon: '💛', rarity: 'uncommon', category: 'economy',
    // 웨이브 클리어마다 골드 +6
    effect: { type: 'wave_clear_gold', amount: 6 },
    dlc: 'solar_dominion',
  },
  {
    id: 'sun_market',
    icon: '☀️', rarity: 'uncommon', category: 'economy',
    // 상점 카드 비용 -2g
    effect: { type: 'shop_discount', amount: 2 },
    dlc: 'solar_dominion',
  },
  {
    id: 'golden_chalice',
    icon: '🏆', rarity: 'rare', category: 'economy',
    // 런 시작 시 골드 +18
    effect: { type: 'start_gold', amount: 18 },
    dlc: 'solar_dominion',
  },

  // ── 방어형 (3) ──────────────────────────────────────
  {
    id: 'solar_ward',
    icon: '🛡️', rarity: 'uncommon', category: 'defense',
    // 넥서스 HP +1
    effect: { type: 'nexus_hp_bonus', amount: 1 },
    dlc: 'solar_dominion',
  },
  {
    id: 'holy_bastion',
    icon: '⛪', rarity: 'rare', category: 'defense',
    // 웨이브당 넥서스 최대 1회 피격
    effect: { type: 'iron_fortress' },
    dlc: 'solar_dominion',
  },
  {
    id: 'blinding_amulet',
    icon: '🌟', rarity: 'uncommon', category: 'defense',
    // 모든 감속 효과 +25% 강화
    effect: { type: 'slow_bonus', mult: 1.25 },
    dlc: 'solar_dominion',
  },

  // ── 시너지형 (2) ─────────────────────────────────────
  {
    id: 'solar_pact_relic',
    icon: '📜', rarity: 'rare', category: 'synergy',
    // Solar 태그 타워 2개+ → 전체 Solar 피해 +30%
    effect: { type: 'solar_pact', extraMult: 0.30, towerTag: 'Solar' },
    dlc: 'solar_dominion',
  },
  {
    id: 'light_prism_bonus',
    icon: '🔮', rarity: 'rare', category: 'synergy',
    // Light Prism 주변 타워 aura 보너스 +10%p 추가 강화
    effect: { type: 'light_prism_bonus', extraDmg: 0.10 },
    dlc: 'solar_dominion',
  },

  // ── 특수형 (2) ──────────────────────────────────────
  {
    id: 'solar_crown',
    icon: '👑', rarity: 'rare', category: 'special',
    // Solar Warden 전용: Solar Charge 최대치 8→6으로 단축
    effect: { type: 'solar_charge_reduce', newMax: 6 },
    dlc: 'solar_dominion',
  },
  {
    id: 'radiant_will',
    icon: '🌠', rarity: 'uncommon', category: 'special',
    // Solar Warden 전용: cost 4+ 주문 시전 시 +1 추가 충전
    effect: { type: 'solar_charge_on_spell', costThreshold: 4, extraCharge: 1 },
    dlc: 'solar_dominion',
  },
];
