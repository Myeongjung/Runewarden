/**
 * Solar Dominion DLC — 맵 (3종)
 * Solar 바이옴 — 태양 기사단 테마
 * 그리드: COLS=14, ROWS=9
 */

export const SOLAR_MAPS = [

  // ── 맵 I: Solar Forum (태양 원형경기장) ───────────────
  // U자형 경로. 중앙 배치 → 3구간 동시 커버. 장거리 타워 극효율.
  {
    id:     'solar_forum',
    name:   'Solar Forum',
    nameKo: '태양 원형경기장',
    icon:   '☀️',
    desc:   'A grand U-shaped arena. Towers at the center cover three segments simultaneously.',
    descKo: '웅장한 U자형 경기장. 중앙 배치 타워가 세 구간을 동시에 커버합니다.',
    theme:  'solar',
    hexColor: '#2e1800', pathColor: 'rgba(245,197,24,0.38)',
    path: [
      [0,7],[1,7],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2],[2,1],
      [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],
      [11,2],[11,3],[11,4],[11,5],[11,6],[11,7],
      [12,7],[13,7],
    ],
    dlc: 'solar_dominion',
  },

  // ── 맵 J: Sunken Temple (가라앉은 사원) ──────────────
  // 수직 지그재그 3회. 32칸 (최장). 배치 공간 제한.
  {
    id:     'sunken_temple',
    name:   'Sunken Temple',
    nameKo: '가라앉은 사원',
    icon:   '🏺',
    desc:   'Three vertical zigzags through ancient ruins. The longest path — use every second well.',
    descKo: '고대 폐허를 관통하는 세 번의 수직 지그재그. 최장 경로 — 매 초를 활용하세요.',
    theme:  'solar',
    hexColor: '#281600', pathColor: 'rgba(232,121,26,0.4)',
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],
      [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],
      [5,7],[6,7],[7,7],[8,7],
      [8,6],[8,5],[8,4],[8,3],[8,2],[8,1],
      [9,1],[10,1],[11,1],[12,1],[13,1],
      [13,2],[13,3],[13,4],[13,5],[13,6],[13,7],
    ],
    dlc: 'solar_dominion',
  },

  // ── 맵 K: Blazing Corridor (불꽃 회랑) ───────────────
  // 직선+S곡선. 22칸. 중앙 광역 커버 포지션 존재.
  {
    id:     'blazing_corridor',
    name:   'Blazing Corridor',
    nameKo: '불꽃 회랑',
    icon:   '🌅',
    desc:   'A straight hall curves into an S-bend. One central tower position covers three lanes.',
    descKo: '직선 통로가 S자 곡선으로 이어집니다. 중앙 1개 포지션이 세 구간을 커버합니다.',
    theme:  'solar',
    hexColor: '#2e1600', pathColor: 'rgba(255,160,30,0.38)',
    path: [
      [0,4],[1,4],[2,4],[3,4],[4,4],
      [5,4],[5,3],[5,2],[5,1],
      [6,1],[7,1],[8,1],[9,1],[10,1],
      [10,2],[10,3],[10,4],
      [11,4],[12,4],[13,4],
    ],
    dlc: 'solar_dominion',
  },
];
