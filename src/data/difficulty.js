/**
 * Runewarden — 난이도 정의
 *
 * 각 난이도는 적 스케일링, 넥서스 HP, 시작 골드 보정 등을 변경합니다.
 */

export const DIFFICULTY_DEFS = [
  {
    id:       'novice',
    icon:     '🌱',
    hpScale:  0.85,          // 1.10 → 0.85: 기본 스탯 대비 실제 감소 (진정한 Easy)
    nexusHp:  3,             // +3 → 기본 HP 기준 6 (보스 2~3방 버텨도 생존)
    goldBonus: 10,           // +5 → +10: 35g 시작으로 초반 배치 여유 확보
    shopDiscount: 2,         // -1 → -2: 선택 폭 확대
    waveGoldBonus: 5,        // +2 → +5: 13g 웨이브 보상 (여유로운 후반 경제)
    bossHpScale: 0.80,       // 신규: 보스 HP 20% 감소 (입문자 보스 클리어 경험 보장)
    enrageMult: 1.3,         // 신규: 격노 속도 배율 1.8→1.3 (위협이지만 즉사 아님)
    spawnIntervalMult: 1.25, // 신규: 스폰 간격 25% 확장 (Wave 1부터)
    spawnIntervalStartWave: 0, // 신규: Novice는 첫 웨이브부터 간격 완화
    noviceRegen: true,       // 신규: 재생 적 DPS 절반 (학습 곡선 완화)
  },
  {
    id:       'standard',
    icon:     '⚔️',
    hpScale:  1.15,
    nexusHp:  0,             // 기본 Warden HP 그대로
    goldBonus: 0,
    shopDiscount: 0,
    waveGoldBonus: 1,        // 0 → +1: 9g 웨이브 보상 (의사결정 여유 소폭 확보)
    enrageMult: 1.8,         // 명시적 기본값 등록 (Novice 1.3 / Veteran 2.0 사이 중간점)
  },
  {
    id:       'veteran',
    icon:     '💀',
    hpScale:  1.40,          // 1.22 → 1.40: Standard(1.15) 대비 실질적인 격차
    nexusHp:  -1,            // 넥서스 HP -1
    goldBonus: -7,           // -3 → -7: 초반 경제 압박 실질화 (18g 시작)
    shopDiscount: 0,
    waveGoldBonus: -2,       // -1 → -3 → -2: Asc3 서차지 복합 경제 압박 완화
    eliteBonus: 0.35,        // 0.20 → 0.35: 엘리트 HP 추가 35%
    bossHpScale: 1.25,       // 신규: 보스 HP 1.25× 스케일링
    enrageMult: 2.0,         // 신규: 격노 속도 배율 1.8 → 2.0
    spawnIntervalMult: 0.85,   // 신규: 스폰 간격 15% 단축 (Wave 4부터)
    spawnIntervalStartWave: 3, // Veteran은 Wave 4(index 3)부터 압박 시작
    veteranRegen: true,        // 신규: 재생 적 DPS 강화 플래그
  },
];

export function getDifficultyById(id) {
  return DIFFICULTY_DEFS.find(d => d.id === id) ?? DIFFICULTY_DEFS[1];
}
