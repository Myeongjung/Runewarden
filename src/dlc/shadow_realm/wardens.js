/**
 * Shadow Realm DLC — 워든 정의 (1명)
 * Shadow Realm Warden: 5번째 워든
 */

import { CARD_DEFS } from '../../data/cards.js';

function makeDeck(ids) {
  return ids.map(id => {
    const def = CARD_DEFS.find(c => c.id === id);
    if (!def) { console.warn('[DLC] 카드 없음:', id); return null; }
    return { ...def, uid: Math.random() };
  }).filter(Boolean);
}

export const SHADOW_WARDENS = [
  {
    id:         'shadow_realm',
    name:       'Shadow Realm Warden',
    title:      'The Phantom',
    icon:       '👁️',
    color:      '#7B2FBE',
    accentBg:   'linear-gradient(135deg, #0d0020 0%, #1a0035 50%, #0d0020 100%)',
    unlockRank: 0,   // DLC 소유 시 바로 접근, isDlcOwned로 추가 체크
    tagline:    '"From the void, power."',
    desc: {
      en: 'Each kill charges Shadow Energy. At 10 charges, a devastating shadow spell auto-casts. Low starting gold — master of the darkness.',
      ko: '처치할 때마다 그림자 에너지가 충전됩니다. 10회 충전 시 강력한 그림자 주문이 자동 시전됩니다. 시작 골드가 낮습니다 — 어둠의 지배자.',
    },

    // 시작 조건
    startGold:  20,    // 적은 골드 — 고위험 고보상
    handSize:   6,     // 패 1장 추가 (많은 카드 필요)
    nexusHp:    2,     // 위험한 시작 — 실수 1번이 치명적
    passive:    'shadow_charge',
    passiveKey: 'dlc_sr_passive_desc',

    // 스타터 덱 (14장)
    buildDeck: () => makeDeck([
      // 소환 4장
      'summon_bone_archer',  'summon_bone_archer',
      'summon_shadow_strike',
      'summon_void_sentinel',
      // 강화 4장
      'aug_cursed_blade',    'aug_cursed_blade',
      'aug_shadow_veil',
      'aug_death_mark',
      // 주문 6장
      'spell_soul_drain',    'spell_soul_drain',
      'spell_darkness',
      'spell_shadow_nova',
      'spell_void_pulse',
      'spell_sacrifice',
    ]),

    tips: [
      i18n_tip('처치를 최대화하세요 — Shadow Charge가 빠를수록 강력한 자동 주문이 발동합니다.'),
      i18n_tip('넥서스 HP가 2뿐입니다. Spell: Shadow Mend나 이벤트 치유로 보전하세요.'),
      i18n_tip('Soul Drain + Sacrifice 콤보: 배틀 중 패를 골드로 전환해 긴급 자금을 마련하세요.'),
    ],
    dlc: 'shadow_realm',
  },
];

// 팁은 언어 무관하게 표시 (i18n 키로 교체 예정)
function i18n_tip(ko) { return ko; }
