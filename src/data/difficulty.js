/**
 * Runewarden — 난이도 정의
 *
 * 각 난이도는 적 스케일링, 넥서스 HP, 시작 골드 보정 등을 변경합니다.
 */

export const DIFFICULTY_DEFS = [
  {
    id:       'novice',
    icon:     '🌱',
    hpScale:  1.10,   // 웨이브별 적 HP 배율 (기본 1.15)
    nexusHp:  5,      // 기본 3에서 +2
    goldBonus: 5,     // 시작 골드 추가
    shopDiscount: 1,  // 상점 카드 -1g
    waveGoldBonus: 2, // 웨이브 클리어 +2g 추가
  },
  {
    id:       'standard',
    icon:     '⚔️',
    hpScale:  1.15,
    nexusHp:  0,      // 기본 Warden HP 그대로
    goldBonus: 0,
    shopDiscount: 0,
    waveGoldBonus: 0,
  },
  {
    id:       'veteran',
    icon:     '💀',
    hpScale:  1.22,   // 더 빠른 스케일링
    nexusHp:  -1,     // 넥서스 HP -1
    goldBonus: -3,    // 시작 골드 감소
    shopDiscount: 0,
    waveGoldBonus: -1, // 웨이브 보상 감소
    eliteBonus: 0.2,   // 엘리트 HP 추가 20%
  },
];

export function getDifficultyById(id) {
  return DIFFICULTY_DEFS.find(d => d.id === id) ?? DIFFICULTY_DEFS[1];
}
