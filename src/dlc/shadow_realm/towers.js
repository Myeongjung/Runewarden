/**
 * Shadow Realm DLC — 타워 정의 (3종)
 * src/data/towers.js의 TOWER_DEFS 객체에 병합됩니다.
 */

export const SHADOW_TOWER_DEFS = {

  // ── 1. Void Sentinel (공허 파수꾼) ─────────────────────
  // 고피해 장거리 저격수. 방어력 25% 무시. 느린 공속.
  void_sentinel: {
    id:          'void_sentinel',
    name:        'Void Sentinel',
    nameKo:      '공허 파수꾼',
    icon:        '🌌',
    color:       '#0D0025',
    accentColor: '#7B2FBE',
    damage:      65,
    range:       5.8,
    attackSpeed: 3800,
    splash:      0,
    armorPen:    0.25,   // 피해 감소 25% 무시
    tags:        ['Shadow', 'Void'],
    shape:       'archer',
    dlc:         'shadow_realm',
  },

  // ── 2. Shadow Weaver (그림자 직조자) ─────────────────────
  // 중거리, 빠른 공속, 명중 시 Shadow DoT 부여.
  shadow_weaver: {
    id:              'shadow_weaver',
    name:            'Shadow Weaver',
    nameKo:          '그림자 직조자',
    icon:            '🕷️',
    color:           '#1A001A',
    accentColor:     '#C040C0',
    damage:          15,
    range:           4.0,
    attackSpeed:     850,
    splash:          0,
    shadowDotDps:    6,     // Shadow DoT: 초당 6 피해
    shadowDotDur:    3000,  // 3초 지속
    tags:            ['Shadow'],
    shape:           'archer',
    dlc:             'shadow_realm',
  },

  // ── 3. Phantom Sniper (환영 저격수) ──────────────────────
  // 최장 사거리, 초고피해, 매우 느린 공속.
  // 감속 적에게 공격 시 2배 피해 (크리티컬).
  phantom_sniper: {
    id:          'phantom_sniper',
    name:        'Phantom Sniper',
    nameKo:      '환영 저격수',
    icon:        '👁️',
    color:       '#0A0A20',
    accentColor: '#4040FF',
    damage:      120,
    range:       7.5,
    attackSpeed: 4500,
    splash:      0,
    critOnSlow:  2.0,   // 감속 적에게 2배 피해
    camoDetect:  true,  // 위장 적 감지 가능
    tags:        ['Shadow', 'Void'],
    shape:       'archer',
    dlc:         'shadow_realm',
  },

  // ── 4. Soul Reaper (영혼 수확자) ──────────────────────
  // 3중 디버프 특화 타워: 극강 감속(60%) + 그림자 DoT + 방어관통.
  // 직접 피해 최소화 — 적의 생존 시간을 연장해 딜러 타워가 처리하게 함.
  soul_reaper: {
    id:           'soul_reaper',
    name:         'Soul Reaper',
    nameKo:       '영혼 수확자',
    icon:         '💀',
    color:        '#0A001A',
    accentColor:  '#8B00FF',
    damage:       6,
    range:        4.5,
    attackSpeed:  1800,
    splash:       0,
    slowEffect:   0.60,
    slowDuration: 3500,
    shadowDotDps: 14,
    shadowDotDur: 6000,
    armorPen:     0.25,
    camoDetect:   true, // 위장 적 감지 가능
    tags:         ['Shadow', 'Void'],
    shape:        'mage',
    dlc:          'shadow_realm',
  },
};
