/**
 * Shadow Realm DLC — 이벤트 데이터 (10종)
 * Shadow / Void / Death 테마. EN/KO 통합.
 */

export const SHADOW_EVENTS = {
  en: [
    {
      id: 'shadow_oracle', title: 'Shadow Oracle', icon: '🔮',
      flavor: 'A being woven from pure darkness offers you a sliver of forbidden power.',
      choices: [
        { label: 'Accept Knowledge', desc: 'Add 1 Rare Shadow card to your deck', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Refuse',           desc: '+12 gold',                             effect: { type: 'gold', amount: 12 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'void_rift', title: 'Void Rift', icon: '🌀',
      flavor: 'A tear in the fabric of reality slows everything that passes through it.',
      choices: [
        { label: 'Harness the Rift', desc: 'Next wave enemies enter at −30% speed', effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: 'Seal It',          desc: '+8 gold',                               effect: { type: 'gold', amount: 8 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'soul_bargain', title: "Soul Bargain", icon: '💀',
      flavor: 'The void whispers a dark exchange — power now, at a price paid in blood.',
      choices: [
        { label: 'Accept the Deal', desc: '+20 gold, lose 1 Nexus HP', effect: { type: 'cursed_gold', amount: 20, nexusDmg: 1 } },
        { label: 'Decline',         desc: '+6 gold',                   effect: { type: 'gold', amount: 6 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'phantom_merchant', title: 'Phantom Merchant', icon: '👻',
      flavor: 'A spectral figure materialises, its wares shimmering between worlds.',
      choices: [
        { label: 'Buy Wares',    desc: 'Add 2 random Uncommon cards', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Take the Coin', desc: '+18 gold',                   effect: { type: 'gold', amount: 18 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'dark_epiphany', title: 'Dark Epiphany', icon: '🌑',
      flavor: 'A forbidden truth burns itself into your mind. The knowledge is dangerous — and priceless.',
      choices: [
        { label: 'Embrace the Vision', desc: 'Add 1 Rare card to your deck',      effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Dim the Flame',      desc: 'Add 1 Uncommon card to your deck',  effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'corrupted_cache', title: 'Corrupted Cache', icon: '🗝️',
      flavor: 'A shadow-tainted chest overflows with gold — but touching it may cost you dearly.',
      choices: [
        { label: 'Claim the Cache', desc: '+25 gold, lose 1 Nexus HP', effect: { type: 'cursed_gold', amount: 25, nexusDmg: 1 } },
        { label: 'Leave It',        desc: '+12 gold (safe)',            effect: { type: 'gold', amount: 12 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'shadow_shrine', title: 'Shadow Shrine', icon: '🕯️',
      flavor: 'An ancient altar pulsates with residual life force. Its blessing is real, though its origin dark.',
      choices: [
        { label: 'Pray for Restoration', desc: 'Restore 1 Nexus HP',         effect: { type: 'heal_nexus', amount: 1 } },
        { label: 'Loot the Offering',    desc: 'Add 1 Uncommon card',         effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'void_resonance', title: 'Void Resonance', icon: '🔵',
      flavor: 'Void energy saturates the air, distorting time for those who step through.',
      choices: [
        { label: 'Channel the Wave', desc: 'Next wave enemies −25% speed + 5s extra prep', effect: { type: 'slow_next_wave', amount: 0.25 } },
        { label: 'Draw Power',       desc: 'Add 2 random Common cards',                   effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'death_offering', title: 'Death Offering', icon: '⚰️',
      flavor: 'The shadow gods demand tribute — surrender the weak and the void will reward you.',
      choices: [
        { label: 'Make the Offering', desc: 'Remove 1 random card from deck → +20 gold', effect: { type: 'remove_random_add_gold', amount: 20 } },
        { label: 'Refuse',            desc: 'Add 2 Uncommon cards instead',               effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'abyssal_vision', title: 'Abyssal Vision', icon: '🌊',
      flavor: 'The abyss stares back — and in its depths, you glimpse an arsenal of devastating power.',
      choices: [
        { label: 'Gaze Into the Abyss', desc: 'Add 1 Rare card, lose 1 Nexus HP', effect: { type: 'cursed_gold', amount: 0, nexusDmg: 1 } },
        { label: 'Look Away',           desc: '+10 gold',                          effect: { type: 'gold', amount: 10 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'cursed_bargain', title: 'Cursed Bargain', icon: '🩸',
      flavor: 'A shadowed figure offers power beyond measure — for a price woven into your very deck.',
      choices: [
        { label: 'Sign the Pact', desc: '+20 gold + 1 Rare card — but Dead Weight enters your deck', effect: { type: 'cursed_bargain', curseCard: 'curse_dead_weight', gold: 20 } },
        { label: 'Walk Away',     desc: '+6 gold (no strings attached)',                              effect: { type: 'gold', amount: 6 } },
      ],
      dlc: 'shadow_realm',
    },
  ],
  ko: [
    {
      id: 'shadow_oracle', title: '그림자 신탁', icon: '🔮',
      flavor: '순수한 어둠으로 빚어진 존재가 금지된 힘의 파편을 건네려 합니다.',
      choices: [
        { label: '지식 수락', desc: '희귀 카드 1장을 덱에 추가',  effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '거절',      desc: '+12 골드',                    effect: { type: 'gold', amount: 12 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'void_rift', title: '공허 균열', icon: '🌀',
      flavor: '현실의 틈새가 열리며 그곳을 지나는 모든 것이 느려집니다.',
      choices: [
        { label: '균열 활용', desc: '다음 웨이브 적 이동속도 −30%', effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: '봉인',      desc: '+8 골드',                      effect: { type: 'gold', amount: 8 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'soul_bargain', title: '영혼 거래', icon: '💀',
      flavor: '공허가 어두운 교환을 속삭입니다 — 지금의 힘, 피로 치르는 대가.',
      choices: [
        { label: '거래 수락', desc: '+20 골드, 넥서스 HP 1 감소', effect: { type: 'cursed_gold', amount: 20, nexusDmg: 1 } },
        { label: '거절',      desc: '+6 골드',                    effect: { type: 'gold', amount: 6 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'phantom_merchant', title: '환영 상인', icon: '👻',
      flavor: '세계 사이를 유영하는 유령 같은 형체가 물건을 늘어놓습니다.',
      choices: [
        { label: '물건 구매', desc: '언커먼 카드 2장 추가', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '동전 수령', desc: '+18 골드',             effect: { type: 'gold', amount: 18 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'dark_epiphany', title: '어둠의 깨달음', icon: '🌑',
      flavor: '금지된 진실이 머릿속에 각인됩니다. 위험하지만 값을 매길 수 없는 지식입니다.',
      choices: [
        { label: '환상 수용', desc: '희귀 카드 1장을 덱에 추가',   effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '불꽃 억제', desc: '언커먼 카드 1장을 덱에 추가', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'corrupted_cache', title: '오염된 보관함', icon: '🗝️',
      flavor: '그림자에 오염된 상자가 금화로 가득 차 있습니다 — 하지만 만지면 대가를 치러야 합니다.',
      choices: [
        { label: '보관함 탈취', desc: '+25 골드, 넥서스 HP 1 감소', effect: { type: 'cursed_gold', amount: 25, nexusDmg: 1 } },
        { label: '그냥 둬',     desc: '+12 골드 (안전)',             effect: { type: 'gold', amount: 12 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'shadow_shrine', title: '그림자 성소', icon: '🕯️',
      flavor: '고대 제단이 생명력의 여운으로 맥동합니다. 근원은 어둡지만 축복은 진짜입니다.',
      choices: [
        { label: '회복 기도', desc: '넥서스 HP 1 회복',    effect: { type: 'heal_nexus', amount: 1 } },
        { label: '제물 약탈', desc: '언커먼 카드 1장 추가', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'void_resonance', title: '공허 공명', icon: '🔵',
      flavor: '공허 에너지가 공기를 가득 채우며 그 속을 지나는 이들의 시간을 뒤틀어 놓습니다.',
      choices: [
        { label: '파동 흡수', desc: '다음 웨이브 적 −25% 감속', effect: { type: 'slow_next_wave', amount: 0.25 } },
        { label: '힘 흡수',   desc: '커먼 카드 2장 추가',       effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'death_offering', title: '죽음의 제물', icon: '⚰️',
      flavor: '그림자 신들이 공물을 요구합니다 — 약한 것을 바치면 공허가 보상합니다.',
      choices: [
        { label: '제물 바치기', desc: '덱에서 카드 1장 제거 → +20 골드', effect: { type: 'remove_random_add_gold', amount: 20 } },
        { label: '거절',        desc: '언커먼 카드 2장 추가',             effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'abyssal_vision', title: '심연의 환상', icon: '🌊',
      flavor: '심연이 되돌아봅니다 — 그 깊은 곳에서 파괴적인 힘의 무기고를 엿봅니다.',
      choices: [
        { label: '심연을 바라보다', desc: '희귀 카드 1장 추가, 넥서스 HP 1 감소', effect: { type: 'cursed_gold', amount: 0, nexusDmg: 1 } },
        { label: '눈을 돌리다',    desc: '+10 골드',                             effect: { type: 'gold', amount: 10 } },
      ],
      dlc: 'shadow_realm',
    },
    {
      id: 'cursed_bargain', title: '저주받은 거래', icon: '🩸',
      flavor: '그림자 속 인물이 헤아릴 수 없는 힘을 제안합니다 — 당신의 덱 깊숙이 짜인 대가와 함께.',
      choices: [
        { label: '계약에 서명', desc: '+20 골드 + 희귀 카드 1장 — 단, 무거운 짐이 덱에 추가됩니다', effect: { type: 'cursed_bargain', curseCard: 'curse_dead_weight', gold: 20 } },
        { label: '거절',       desc: '+6 골드 (조건 없음)',                                         effect: { type: 'gold', amount: 6 } },
      ],
      dlc: 'shadow_realm',
    },
  ],
};
