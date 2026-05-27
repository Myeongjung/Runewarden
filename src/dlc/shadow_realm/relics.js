/**
 * Shadow Realm DLC — 유물 (15개)
 * Shadow / Void / Death 테마
 */

export const SHADOW_RELICS = [

  // ── 공격형 (5) ──────────────────────────────────────
  {
    id: 'shadow_crystal',
    icon: '🔮', rarity: 'uncommon', category: 'attack',
    effect: { type: 'tower_dmg_bonus', towerType: 'shadow_strike', mult: 1.5 },
    dlc: 'shadow_realm',
  },
  {
    id: 'void_lens',
    icon: '👁️', rarity: 'rare', category: 'attack',
    effect: { type: 'tower_range_bonus', towerType: 'void_sentinel', mult: 1.6 },
    dlc: 'shadow_realm',
  },
  {
    id: 'phantom_edge',
    icon: '⚔️', rarity: 'uncommon', category: 'attack',
    // 모든 타워 피해 +12%
    effect: { type: 'tower_dmg_bonus', towerType: '__all__', mult: 1.12 },
    dlc: 'shadow_realm',
  },
  {
    id: 'death_shroud',
    icon: '🌑', rarity: 'uncommon', category: 'attack',
    // 적 처치 시 추가 골드 +2 (일반 적 기준)
    effect: { type: 'kill_gold_bonus', amount: 2 },
    dlc: 'shadow_realm',
  },
  {
    id: 'void_core',
    icon: '🌀', rarity: 'rare', category: 'attack',
    // 모든 타워 공격속도 +20%
    effect: { type: 'tower_speed_bonus', towerType: '__all__', mult: 0.8 },
    dlc: 'shadow_realm',
  },

  // ── 경제형 (3) ──────────────────────────────────────
  {
    id: 'shadow_hoard',
    icon: '💜', rarity: 'uncommon', category: 'economy',
    // 웨이브 클리어마다 골드 +4 (파워 크리프 조정: 5→4)
    effect: { type: 'wave_clear_gold', amount: 4 },
    dlc: 'shadow_realm',
  },
  {
    id: 'void_market',
    icon: '🏪', rarity: 'uncommon', category: 'economy',
    // 상점 카드 비용 -2g
    effect: { type: 'shop_discount', amount: 2 },
    dlc: 'shadow_realm',
  },
  {
    id: 'souls_purse',
    icon: '💰', rarity: 'rare', category: 'economy',
    // 런 시작 시 골드 +15
    effect: { type: 'start_gold', amount: 15 },
    dlc: 'shadow_realm',
  },

  // ── 방어형 (3) ──────────────────────────────────────
  {
    id: 'shadow_ward',
    icon: '🛡️', rarity: 'uncommon', category: 'defense',
    // 넥서스 HP +1
    effect: { type: 'nexus_hp_bonus', amount: 1 },
    dlc: 'shadow_realm',
  },
  {
    id: 'void_anchor',
    icon: '⚓', rarity: 'rare', category: 'defense',
    // 웨이브당 넥서스 최대 1회 피격
    effect: { type: 'iron_fortress' },
    dlc: 'shadow_realm',
  },
  {
    id: 'death_veil',
    icon: '🌫️', rarity: 'uncommon', category: 'defense',
    // 모든 감속 효과 +30% 강화
    effect: { type: 'slow_bonus', mult: 1.30 },
    dlc: 'shadow_realm',
  },

  // ── 시너지형 (2) ─────────────────────────────────────
  {
    id: 'shadow_pact',
    icon: '📜', rarity: 'rare', category: 'synergy',
    // Shadow 타워 2개+ → 전체 Shadow 피해 +30%
    effect: { type: 'fire_pact', extraMult: 0.30, towerTag: 'Shadow' },
    dlc: 'shadow_realm',
  },
  {
    id: 'void_echo_relic',
    icon: '🔊', rarity: 'rare', category: 'synergy',
    // 주문 시전 후 모든 Void 타워 즉시 발사 — 8초 쿨다운으로 연속 버스트 방지
    effect: { type: 'storm_circuit', towerTag: 'Void', cooldownMs: 8000 },
    dlc: 'shadow_realm',
  },

  // ── 특수형 (2) ──────────────────────────────────────
  {
    id: 'charge_crystal',
    icon: '💎', rarity: 'rare', category: 'special',
    // Shadow Warden 전용: Shadow Charge 최대치 10→8로 단축
    effect: { type: 'shadow_charge_reduce', newMax: 8 },
    dlc: 'shadow_realm',
  },
  {
    id: 'undying_will',
    icon: '🩸', rarity: 'uncommon', category: 'special',
    // Shadow Warden 전용: 5처치마다 Shadow Charge +1 보너스 충전
    effect: { type: 'shadow_charge_on_kills', killsPerCharge: 5 },
    dlc: 'shadow_realm',
  },
];
