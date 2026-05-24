/**
 * Runewarden — Ascension Mode 정의
 *
 * Rank 20 달성 후 해금. Veteran 난이도 위에 핸디캡 레이어를 추가.
 * 각 레벨은 이전 레벨 클리어 후 해금됨.
 *
 * mods 필드:
 *  shopSize     — 상점에 표시되는 카드 수 감소
 *  noInterest   — 이자 시스템 비활성화
 *  extraSurcharge — 웨이브 중 카드 추가 비용 (기본 +1에 더해짐)
 */

export const ASCENSION_DEFS = [
  {
    level: 1,
    icon:  '💠',
    mods:  { shopSize: 2 },
  },
  {
    level: 2,
    icon:  '💎',
    mods:  { noInterest: true },
  },
  {
    level: 3,
    icon:  '👑',
    mods:  { extraSurcharge: 1 },
  },
  {
    level: 4,
    icon:  '🔥',
    mods:  { hpScaleMult: 0.12 },
  },
  {
    level: 5,
    icon:  '☠️',
    mods:  { hpScaleMult: 0.12 },
  },
];

export function getAscensionDef(level) {
  return ASCENSION_DEFS.find(a => a.level === level) ?? null;
}

/**
 * 누적 mods 반환 — 레벨 N은 1~N 모두 누적 적용
 */
export function getAscensionMods(level) {
  const mods = { shopSize: 3, noInterest: false, extraSurcharge: 0, hpScaleMult: 0 };
  for (const def of ASCENSION_DEFS) {
    if (def.level > level) break;
    if (def.mods.shopSize       !== undefined) mods.shopSize       = def.mods.shopSize;
    if (def.mods.noInterest     !== undefined) mods.noInterest     = def.mods.noInterest;
    if (def.mods.extraSurcharge !== undefined) mods.extraSurcharge += def.mods.extraSurcharge;
    if (def.mods.hpScaleMult    !== undefined) mods.hpScaleMult    += def.mods.hpScaleMult;
  }
  return mods;
}
