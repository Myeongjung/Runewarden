/**
 * Runewarden — 유물(Relic) 정의
 * 런 시작 시 3개 중 1개 선택. 런 전체에 걸쳐 패시브 효과 적용.
 * Balatro 조커 / Slay the Spire 유물에 해당하는 시스템.
 *
 * effect.type 목록:
 *  'start_gold'        — 런 시작 시 추가 골드
 *  'wave_clear_gold'   — 웨이브 클리어마다 추가 골드
 *  'shop_discount'     — 상점 카드 비용 감소
 *  'nexus_hp_bonus'    — 런 시작 넥서스 HP +N
 *  'interest_low'      — 이자 임계값을 5g으로 낮춤 (기본 10g)
 *  'interest_bonus'    — 이자 발생 시 추가 골드 (amount)
 *  'shield_first_hit'  — 넥서스 첫 피격 1회 무효화
 *  'iron_fortress'     — 웨이브당 넥서스 최대 1회 피격
 *  'thorn_wall'        — 넥서스 피격 시 최근접 적에게 반사 피해 (damage)
 *  'tower_dmg_bonus'   — 특정 타워 타입 데미지 배율
 *  'tower_range_bonus' — 특정 타워 타입 사거리 배율
 *  'tower_speed_bonus' — 특정 타워 타입 공격속도 배율
 *  'siege_splash'      — Cannon 폭발 반경 확대 (mult)
 *  'fire_pact'         — Fire Drake 2개+ 시 데미지 증폭 (extraMult)
 *  'storm_circuit'     — 주문 시전 후 Tesla 즉시 발사
 *  'venom_fang'        — 처치 시 무작위 적에게 독 피해 (damage)
 *  'burn_bonus'        — 번(DoT) 효과 강화
 *  'chain_bonus'       — Tesla 추가 체인
 *  'druid_aura_bonus'  — Druid 버프 강화
 *  'slow_bonus'        — 모든 감속 효과 강화
 *  'card_draw_bonus'   — 웨이브 시작 시 카드 추가 드로우
 *  'wave_draw'         — 웨이브 클리어 후 즉시 카드 추가 드로우 (amount)
 *  'kill_gold_bonus'   — 처치 보상 추가 골드
 *  'free_reroll'       — 상점 방문당 첫 리롤 무료
 *  'blood_price'       — 넥서스 HP 1 희생 → 즉시 골드 획득 (goldGain, hpCost)
 */

import { SHADOW_RELICS } from '../dlc/shadow_realm/relics.js';
import { SOLAR_RELICS }  from '../dlc/solar_dominion/relics.js';

const _BASE_RELIC_DEFS = [

  // ── 공격형 (Attack) ─────────────────────────────────

  {
    id: 'whetstone',
    icon: '🪨',
    rarity: 'common',
    category: 'attack',
    effect: { type: 'tower_dmg_bonus', towerType: 'archer', mult: 1.3 },
  },
  {
    id: 'blast_powder',
    icon: '💣',
    rarity: 'common',
    category: 'attack',
    effect: { type: 'tower_range_bonus', towerType: 'cannon', mult: 1.4 },
  },
  {
    id: 'ember_core',
    icon: '🔥',
    rarity: 'uncommon',
    category: 'attack',
    effect: { type: 'burn_bonus', extraDps: 4, extraDuration: 800 },
  },
  {
    id: 'static_coil',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'attack',
    effect: { type: 'chain_bonus', extra: 1 },
  },
  {
    id: 'ancient_bark',
    icon: '🌿',
    rarity: 'uncommon',
    category: 'attack',
    effect: { type: 'druid_aura_bonus', extraMult: 0.10 },
  },

  // ── 경제형 (Economy) ─────────────────────────────────

  {
    id: 'merchants_badge',
    icon: '🏅',
    rarity: 'common',
    category: 'economy',
    effect: { type: 'wave_clear_gold', amount: 3 },
  },
  {
    id: 'gold_lens',
    icon: '🔍',
    rarity: 'common',
    category: 'economy',
    effect: { type: 'shop_discount', amount: 1 },
  },
  {
    id: 'lucky_coin',
    icon: '🍀',
    rarity: 'uncommon',
    category: 'economy',
    effect: { type: 'interest_low', threshold: 5 },
  },
  {
    id: 'war_chest',
    icon: '📦',
    rarity: 'common',
    category: 'economy',
    effect: { type: 'start_gold', amount: 10 },
  },
  {
    id: 'bounty_mark',
    icon: '🎯',
    rarity: 'uncommon',
    category: 'economy',
    effect: { type: 'kill_gold_bonus', amount: 1 },
  },

  // ── 방어형 (Defense) ─────────────────────────────────

  {
    id: 'aegis_fragment',
    icon: '🛡️',
    rarity: 'uncommon',
    category: 'defense',
    effect: { type: 'nexus_hp_bonus', amount: 1 },
  },
  {
    id: 'soul_anchor',
    icon: '⚓',
    rarity: 'rare',
    category: 'defense',
    effect: { type: 'shield_first_hit' },
  },
  {
    id: 'frost_ward',
    icon: '❄️',
    rarity: 'uncommon',
    category: 'defense',
    effect: { type: 'slow_bonus', mult: 1.25 },
  },

  // ── 시너지형 (Synergy) ───────────────────────────────

  {
    id: 'swift_quiver',
    icon: '🏹',
    rarity: 'rare',
    category: 'synergy',
    effect: { type: 'card_draw_bonus', amount: 1 },
  },
  {
    id: 'arcane_focus',
    icon: '🔮',
    rarity: 'rare',
    category: 'synergy',
    effect: { type: 'tower_speed_bonus', towerType: 'tesla', mult: 0.75 },  // 공격간격 × 0.75 = 25% 빠름
  },

  // ── 공격형 신규 (Attack — New) ───────────────────────

  {
    id: 'venom_fang',
    icon: '🐍',
    rarity: 'uncommon',
    category: 'attack',
    effect: { type: 'venom_fang', damage: 15 },
  },
  {
    id: 'siege_engine',
    icon: '💥',
    rarity: 'uncommon',
    category: 'attack',
    effect: { type: 'siege_splash', mult: 1.6 },
  },

  // ── 경제형 신규 (Economy — New) ─────────────────────

  {
    id: 'merchants_ring',
    icon: '💍',
    rarity: 'uncommon',
    category: 'economy',
    effect: { type: 'free_reroll' },
  },
  {
    id: 'savings_bond',
    icon: '📜',
    rarity: 'rare',
    category: 'economy',
    effect: { type: 'interest_bonus', amount: 2 },
  },

  // ── 방어형 신규 (Defense — New) ─────────────────────

  {
    id: 'iron_fortress',
    icon: '🏰',
    rarity: 'rare',
    category: 'defense',
    effect: { type: 'iron_fortress' },
  },
  {
    id: 'thorn_wall',
    icon: '🌵',
    rarity: 'uncommon',
    category: 'defense',
    effect: { type: 'thorn_wall', damage: 25 },
  },

  // ── 시너지형 신규 (Synergy — New) ───────────────────

  {
    id: 'fire_pact',
    icon: '🐉',
    rarity: 'rare',
    category: 'synergy',
    effect: { type: 'fire_pact', extraMult: 0.25 },
  },
  {
    id: 'storm_circuit',
    icon: '🌩️',
    rarity: 'rare',
    category: 'synergy',
    effect: { type: 'storm_circuit' },
  },

  // ── 특수형 신규 (Special — New) ─────────────────────

  {
    id: 'wardens_sigil',
    icon: '📿',
    rarity: 'uncommon',
    category: 'special',
    effect: { type: 'wave_draw', amount: 2 },
  },
  {
    id: 'blood_price',
    icon: '🩸',
    rarity: 'rare',
    category: 'special',
    effect: { type: 'blood_price', goldGain: 20, hpCost: 1 },
  },

  // ── 위장 감지 (Camo Detect) ─────────────────────────

  {
    id: 'keen_eye',
    icon: '👁️',
    rarity: 'uncommon',
    category: 'utility',
    effect: { type: 'camo_detect' },
  },
];

// DLC 유물 병합
export const RELIC_DEFS = [..._BASE_RELIC_DEFS, ...SHADOW_RELICS, ...SOLAR_RELICS];

/** id로 유물 찾기 */
export function getRelicById(id) {
  return RELIC_DEFS.find(r => r.id === id);
}

/** 가중치 랜덤: Rare는 절반 확률 */
export function pickRandomRelics(count, excludeIds = []) {
  const pool = RELIC_DEFS.filter(r => !excludeIds.includes(r.id));
  const weighted = [];
  for (const r of pool) {
    const w = r.rarity === 'rare' ? 1 : r.rarity === 'uncommon' ? 2 : 3;
    for (let i = 0; i < w; i++) weighted.push(r);
  }

  const result = [];
  const usedIds = new Set();
  let tries = 0;
  while (result.length < count && tries < 100) {
    tries++;
    const r = weighted[Math.floor(Math.random() * weighted.length)];
    if (!usedIds.has(r.id)) {
      usedIds.add(r.id);
      result.push(r);
    }
  }
  return result;
}
