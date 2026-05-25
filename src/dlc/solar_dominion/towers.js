/**
 * Solar Dominion DLC — 타워 정의 (4종)
 * src/data/towers.js의 TOWER_DEFS 객체에 병합됩니다.
 */

export const SOLAR_TOWER_DEFS = {

  // ── 1. Divine Cannon (신성 대포) ──────────────────────
  // 단일 타겟 고피해. Solar DoT 부여. 느린 공속.
  divine_cannon: {
    id:           'divine_cannon',
    name:         'Divine Cannon',
    nameKo:       '신성 대포',
    icon:         '🔱',
    color:        '#2E1800',
    accentColor:  '#F5C518',
    damage:       45,
    range:        3.8,
    attackSpeed:  2200,
    splash:       0,
    solarDotDps:  10,
    solarDotDur:  3000,
    tags:         ['Solar', 'Holy'],
    shape:        'cannon',
    dlc:          'solar_dominion',
  },

  // ── 2. Solar Scythe (태양 낫) ─────────────────────────
  // HP 500+ 적에게 +50% 추가 피해. 탱커 처치 특화.
  solar_scythe: {
    id:           'solar_scythe',
    name:         'Solar Scythe',
    nameKo:       '태양 낫',
    icon:         '⚜️',
    color:        '#1A0E00',
    accentColor:  '#E8791A',
    damage:       28,
    range:        4.0,
    attackSpeed:  1800,
    splash:       0,
    tankSlayBonus: 0.50,
    tankSlayHpThreshold: 500,
    tags:         ['Solar'],
    shape:        'archer',
    dlc:          'solar_dominion',
  },

  // ── 3. Light Prism (빛의 프리즘) ─────────────────────
  // 낮은 직접 피해. 인접 타워 aura +20% 피해 +10% 공속.
  light_prism: {
    id:           'light_prism',
    name:         'Light Prism',
    nameKo:       '빛의 프리즘',
    icon:         '🌅',
    color:        '#0E0E1A',
    accentColor:  '#C9B1FF',
    damage:       8,
    range:        3.5,
    attackSpeed:  1200,
    splash:       0,
    lightPrismAura: true,
    lightPrismDmgMult: 1.20,
    lightPrismSpdMult: 0.90,   // attackSpeed multiplier (lower = faster)
    lightPrismRadius: 2.5,     // hex-radius for aura
    tags:         ['Solar', 'Holy'],
    shape:        'mage',
    dlc:          'solar_dominion',
  },

  // ── 4. Crusader (성전사) ──────────────────────────────
  // 범위 공격. 명중 시 400ms 스턴 (타워당 3s 쿨다운).
  crusader: {
    id:           'crusader',
    name:         'Crusader',
    nameKo:       '성전사',
    icon:         '🏺',
    color:        '#1A0E00',
    accentColor:  '#DAA520',
    damage:       32,
    range:        3.2,
    attackSpeed:  1600,
    splash:       1.2,
    stunDuration: 400,
    stunCooldown: 3000,
    tags:         ['Solar', 'Holy'],
    shape:        'cannon',
    dlc:          'solar_dominion',
  },
};
