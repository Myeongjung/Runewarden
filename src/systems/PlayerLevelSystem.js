// 런 내 플레이어 레벨 시스템 — 순수 로직 모듈 (MetaSystem과 완전 분리)

export const MAX_PLAYER_LEVEL = 8;

// 누적 XP 임계값: index 0 = Lv2 진입 필요 XP, index 6 = Lv8 진입 필요 XP
export const XP_THRESHOLDS = [10, 25, 43, 65, 92, 125, 165];

// 희귀도 가중치 테이블 (8행 룩업, 선형 보간 사용 금지)
// [common%, uncommon%, rare%] 합계 = 100
const RARITY_WEIGHTS = [
  [80, 18,  2],  // Lv1
  [72, 24,  4],  // Lv2
  [64, 28,  8],  // Lv3
  [56, 32, 12],  // Lv4
  [48, 34, 18],  // Lv5
  [40, 36, 24],  // Lv6
  [34, 38, 28],  // Lv7
  [28, 40, 32],  // Lv8
];

/**
 * 누적 XP → 현재 레벨 반환 (1~MAX_PLAYER_LEVEL)
 */
export function getLevelFromXp(xp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 2; // index 0 → Lv2
  }
  return 1;
}

/**
 * 현재 레벨에서 다음 레벨 진입에 필요한 누적 XP
 * Lv8(MAX)이면 Infinity 반환
 */
export function getXpForNextLevel(level) {
  if (level >= MAX_PLAYER_LEVEL) return Infinity;
  return XP_THRESHOLDS[level - 1]; // level 1 → index 0 = 10
}

/**
 * 웨이브 클리어 시 지급할 XP: 3 + floor(wave/3)
 * Wave 1~2=3, Wave 3~5=4, Wave 6~8=5, Wave 9~11=6, Wave 12~14=7, Wave 15+=8
 */
export function getWaveXpGrant(wave) {
  return 3 + Math.floor(wave / 3);
}

/**
 * 플레이어 레벨 기반 희귀도 가중치 샘플링
 * @param {number} level 1~8
 * @returns {'common'|'uncommon'|'rare'}
 */
export function weightedPickRarity(level) {
  const idx = Math.min(Math.max(level - 1, 0), RARITY_WEIGHTS.length - 1);
  const [cW, uW, rW] = RARITY_WEIGHTS[idx];
  const roll = Math.random() * 100;
  if (roll < rW) return 'rare';
  if (roll < rW + uW) return 'uncommon';
  return 'common';
}
