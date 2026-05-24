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
    hpScale:  1.40,          // 1.22 → 1.40: Standard(1.15) 대비 실질적인 격차
    nexusHp:  -1,            // 넥서스 HP -1
    goldBonus: -7,           // -3 → -7: 초반 경제 압박 실질화 (18g 시작)
    shopDiscount: 0,
    waveGoldBonus: -3,       // -1 → -3: 웨이브 클리어 보상 5g로 감소
    eliteBonus: 0.35,        // 0.20 → 0.35: 엘리트 HP 추가 35%
    bossHpScale: 1.25,       // 신규: 보스 HP 1.25× 스케일링
    enrageMult: 2.0,         // 신규: 격노 속도 배율 1.8 → 2.0
    spawnIntervalMult: 0.85, // 신규: 스폰 간격 15% 단축 (Wave 4부터)
    veteranRegen: true,      // 신규: 재생 적 DPS 강화 플래그
  },
];

export function getDifficultyById(id) {
  return DIFFICULTY_DEFS.find(d => d.id === id) ?? DIFFICULTY_DEFS[1];
}
