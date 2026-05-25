/**
 * Solar Dominion DLC — 워든 정의 (1명)
 * Solar Warden "The Radiant": 6번째 워든
 * 패시브: Solar Charge — cost ≥ 2 주문 시전 → +1 충전, 8회 → Solar Beam 자동 시전
 */

import { CARD_DEFS } from '../../data/cards.js';

function makeDeck(ids) {
  return ids.map(id => {
    const def = CARD_DEFS.find(c => c.id === id);
    if (!def) { console.warn('[DLC2] 카드 없음:', id); return null; }
    return { ...def, uid: Math.random() };
  }).filter(Boolean);
}

export const SOLAR_WARDENS = [
  {
    id:         'solar_dominion',
    name:       'Solar Warden',
    nameKo:     '태양의 워든',
    title:      'The Radiant',
    icon:       '☀️',
    color:      '#F5C518',
    accentBg:   'linear-gradient(135deg, #1a0e00 0%, #2e1800 50%, #1a0e00 100%)',
    unlockRank: 0,
    tagline:    '"Light burns brightest at the moment of release."',
    desc: {
      en: 'Each spell cast (cost ≥ 2) charges Solar Energy. At 8 charges, a devastating Solar Beam auto-casts. Balanced starting conditions — master of radiant power.',
      ko: 'cost 2 이상 주문을 시전할 때마다 태양 에너지가 충전됩니다. 8회 충전 시 강력한 Solar Beam이 자동 시전됩니다. 균형 잡힌 시작 조건 — 빛의 지배자.',
    },

    startGold:  22,
    handSize:   5,
    nexusHp:    3,
    passive:    'solar_charge_solar',
    passiveKey: 'dlc_sd_passive_desc',

    buildDeck: () => makeDeck([
      // 소환 4장
      'summon_archer',         'summon_archer',
      'summon_divine_cannon',
      'summon_light_prism',
      // 강화 4장
      'aug_radiant_edge',      'aug_radiant_edge',
      'aug_solar_mantle',
      'aug_beacon_light',
      // 주문 6장
      'spell_solar_beam',      'spell_solar_beam',
      'spell_gold_tithe',      'spell_gold_tithe',
      'spell_sunburst',
      'spell_divine_shield',
    ]),

    tips: [
      i18n_tip('cost 2+ 주문을 꾸준히 시전하세요 — Solar Charge가 빠를수록 Solar Beam이 자주 발동합니다.'),
      i18n_tip('Light Prism은 인접 타워를 강화합니다. 중앙에 배치해 시너지를 극대화하세요.'),
      i18n_tip('Divine Shield로 위기 상황을 넘기고, 그 시간 동안 집중 화력을 퍼부으세요.'),
    ],
    dlc: 'solar_dominion',
  },
];

function i18n_tip(ko) { return ko; }
