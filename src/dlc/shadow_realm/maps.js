/**
 * Shadow Realm DLC — 맵 (3종)
 * Shadow Realm 바이옴 — 그림자 왕국 테마
 * 그리드: COLS=14, ROWS=9
 */

export const SHADOW_MAPS = [

  // ── 맵 F: Void Corridor (공허 회랑) ─────────────────────
  // 길고 구불구불한 S자형 경로. 중간 목 지점 2곳.
  {
    id:     'void_corridor',
    name:   'Void Corridor',
    nameKo: '공허 회랑',
    icon:   '🌑',
    desc:   'A long winding passage through the Shadow Realm. Two key chokepoints.',
    descKo: '그림자 왕국을 관통하는 길고 구불구불한 통로. 두 곳의 핵심 목 지점.',
    theme:  'shadow',
    hexColor: '#1a0030', pathColor: 'rgba(140,50,220,0.42)',
    path: [
      [0,2],[1,2],[2,2],[3,2],[4,2],
      [4,3],[4,4],[4,5],[4,6],
      [5,6],[6,6],[7,6],[8,6],
      [8,5],[8,4],[8,3],[8,2],
      [9,2],[10,2],[11,2],[12,2],[13,2],
    ],
    dlc: 'shadow_realm',
  },

  // ── 맵 G: Phantom Crossing (환영 교차로) ─────────────────
  // 중앙에서 교차하는 경로. 타워 커버리지 설계가 중요.
  {
    id:     'phantom_crossing',
    name:   'Phantom Crossing',
    nameKo: '환영 교차로',
    icon:   '👻',
    desc:   'Two paths converge at the center. Coverage and timing are everything.',
    descKo: '두 경로가 중앙에서 만납니다. 커버리지와 타이밍이 핵심.',
    theme:  'shadow',
    hexColor: '#1a0030', pathColor: 'rgba(120,40,200,0.42)',
    path: [
      [0,1],[1,1],[2,1],[3,1],
      [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],
      [4,7],[5,7],[6,7],[7,7],
      [7,6],[7,5],[7,4],[7,3],[7,2],[7,1],
      [8,1],[9,1],[10,1],[11,1],[12,1],[13,1],
    ],
    dlc: 'shadow_realm',
  },

  // ── 맵 H: Abyssal Spiral (심연의 나선) ──────────────────
  // 바깥에서 안쪽으로 말려드는 나선형 경로.
  // 모든 구간이 타워 사거리 안에 들어옴.
  {
    id:     'abyssal_spiral',
    name:   'Abyssal Spiral',
    nameKo: '심연의 나선',
    icon:   '🌀',
    desc:   'A spiraling path that winds inward. Every tower covers multiple segments.',
    descKo: '안쪽으로 말려드는 나선형 경로. 모든 타워가 여러 구간을 커버합니다.',
    theme:  'shadow',
    hexColor: '#1a0030', pathColor: 'rgba(160,60,240,0.4)',
    path: [
      [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
      [6,3],[6,2],[6,1],
      [7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],
      [13,2],[13,3],[13,4],[13,5],[13,6],[13,7],
      [12,7],[11,7],[10,7],[9,7],[8,7],[7,7],
      [7,6],[7,5],
    ],
    dlc: 'shadow_realm',
  },
];
