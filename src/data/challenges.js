/**
 * Runewarden — 챌린지 정의
 *
 * 선택적 핸디캡 레이어. 런 시작 시 0~N개 활성화 가능.
 * 완주 시 활성 챌린지 xpBonus 합산만큼 XP 배율 보너스 제공.
 */

export const CHALLENGE_DEFS = [
  // ── 타워 제한 ──────────────────────────────────────────
  {
    id: 'archer_only',
    icon: '🏹',
    category: 'tower',
    xpBonus: 0.40,
    mods: { allowedTowers: ['archer', 'marksman', 'bone_archer'] },
  },
  {
    id: 'no_frost',
    icon: '🔥',
    category: 'tower',
    xpBonus: 0.20,
    mods: { bannedTowers: ['frost', 'glacial', 'frost_giant'] },
  },
  {
    id: 'no_aoe',
    icon: '🎯',
    category: 'tower',
    xpBonus: 0.25,
    mods: { bannedTowers: ['cannon', 'ballista', 'tesla'] },
  },
  // ── 카드 제한 ──────────────────────────────────────────
  {
    id: 'no_spells',
    icon: '🔇',
    category: 'card',
    xpBonus: 0.25,
    mods: { bannedCardTypes: ['spell'] },
  },
  {
    id: 'no_augments',
    icon: '⛔',
    category: 'card',
    xpBonus: 0.25,
    mods: { bannedCardTypes: ['augment'] },
  },
  {
    id: 'common_only',
    icon: '📜',
    category: 'card',
    xpBonus: 0.30,
    mods: { maxCardRarity: 'common' },
  },
  {
    id: 'fixed_deck',
    icon: '🔒',
    category: 'card',
    xpBonus: 0.35,
    mods: { noShopBuy: true },
  },
  // ── 경제 제한 ──────────────────────────────────────────
  {
    id: 'poverty',
    icon: '💸',
    category: 'economy',
    xpBonus: 0.25,
    mods: { startGold: 10 },
  },
  {
    id: 'no_reroll',
    icon: '🎲',
    category: 'economy',
    xpBonus: 0.20,
    mods: { noReroll: true },
  },
  {
    id: 'no_rest',
    icon: '⚡',
    category: 'economy',
    xpBonus: 0.20,
    mods: { noRest: true },
  },
  // ── 런 조건 ────────────────────────────────────────────
  {
    id: 'perfect_nexus',
    icon: '💎',
    category: 'run',
    xpBonus: 0.50,
    mods: { nexusPerfect: true },
  },
  {
    id: 'auto_shop',
    icon: '🗺️',
    category: 'run',
    xpBonus: 0.15,
    mods: { forceNode: 'shop' },
  },
  {
    id: 'no_event',
    icon: '📋',
    category: 'run',
    xpBonus: 0.10,
    mods: { noEvent: true },
  },
];

export function getChallengeById(id) {
  return CHALLENGE_DEFS.find(c => c.id === id) ?? null;
}

/** 활성 챌린지들의 XP 보너스 합산 (0.0 ~ N.0) */
export function getChallengeXPBonus(ids) {
  return ids.reduce((sum, id) => sum + (getChallengeById(id)?.xpBonus ?? 0), 0);
}

/** 활성 챌린지들의 mods 합산 반환 */
export function getChallengeMods(ids) {
  const mods = {
    allowedTowers:   null,   // null = 모든 타워 허용
    bannedTowers:    [],
    bannedCardTypes: [],
    maxCardRarity:   null,   // null = 모든 등급 허용
    noShopBuy:       false,
    startGold:       null,   // null = 기본값 사용
    noReroll:        false,
    noRest:          false,
    nexusPerfect:    false,
    forceNode:       null,
    noEvent:         false,
  };
  for (const id of ids) {
    const m = getChallengeById(id)?.mods ?? {};
    if (m.allowedTowers)     mods.allowedTowers   = m.allowedTowers;
    if (m.bannedTowers)      mods.bannedTowers.push(...m.bannedTowers);
    if (m.bannedCardTypes)   mods.bannedCardTypes.push(...m.bannedCardTypes);
    if (m.maxCardRarity)     mods.maxCardRarity    = m.maxCardRarity;
    if (m.noShopBuy)         mods.noShopBuy        = true;
    if (m.startGold != null) mods.startGold        = m.startGold;
    if (m.noReroll)          mods.noReroll         = true;
    if (m.noRest)            mods.noRest           = true;
    if (m.nexusPerfect)      mods.nexusPerfect     = true;
    if (m.forceNode)         mods.forceNode        = m.forceNode;
    if (m.noEvent)           mods.noEvent          = true;
  }
  return mods;
}
