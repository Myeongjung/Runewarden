/**
 * Solar Dominion DLC — 이벤트 데이터 (10종)
 * Solar / Holy / Light 테마. EN/KO 통합.
 */

export const SOLAR_EVENTS = {
  en: [
    {
      id: 'solar_oracle', title: 'Solar Oracle', icon: '☀️',
      flavor: 'A blazing seer emerges from the heatwaves, offering visions of radiant destruction.',
      choices: [
        { label: 'Accept Vision',   desc: 'Add 1 Rare Solar card to your deck',  effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Refuse',          desc: '+14 gold',                             effect: { type: 'gold', amount: 14 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'sunfire_cache', title: 'Sunfire Cache', icon: '🔥',
      flavor: 'An ornate golden chest radiates heat. The riches inside could change everything.',
      choices: [
        { label: 'Claim the Riches', desc: '+28 gold, lose 1 Nexus HP',           effect: { type: 'cursed_gold', amount: 28, nexusDmg: 1 } },
        { label: 'Leave It',         desc: '+14 gold (safe)',                      effect: { type: 'gold', amount: 14 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'holy_shrine', title: 'Holy Shrine', icon: '⛪',
      flavor: 'A radiant altar pulses with ancient light. Its blessing is warm and unconditional.',
      choices: [
        { label: 'Pray for Healing',  desc: 'Restore 1 Nexus HP',                 effect: { type: 'heal_nexus', amount: 1 } },
        { label: 'Receive Knowledge', desc: 'Add 1 Uncommon card to your deck',   effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'radiant_merchant', title: 'Radiant Merchant', icon: '🏺',
      flavor: 'A golden-robed trader appears, wares gleaming in the perpetual sunlight.',
      choices: [
        { label: 'Browse Wares',   desc: 'Add 2 random Uncommon cards',           effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: 'Buy Supplies',   desc: '+20 gold',                              effect: { type: 'gold', amount: 20 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_revelation', title: 'Solar Revelation', icon: '🌅',
      flavor: 'The dawn breaks with terrible clarity — you see paths through the battle no mortal has charted.',
      choices: [
        { label: 'Seize the Vision', desc: 'Add 1 Rare card to your deck',        effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: 'Steady your Mind', desc: 'Add 1 Uncommon card to your deck',    effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'blinding_gale', title: 'Blinding Gale', icon: '💨',
      flavor: 'Solar winds howl through the battlefield, disorienting the advancing legion.',
      choices: [
        { label: 'Channel the Wind', desc: 'Next wave enemies −30% speed',        effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: 'Stand Firm',       desc: '+10 gold',                            effect: { type: 'gold', amount: 10 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_tribute', title: 'Solar Tribute', icon: '💛',
      flavor: 'The sun demands sacrifice. Give freely and it will repay you manifold.',
      choices: [
        { label: 'Pay the Tribute', desc: '+30 gold, lose 1 Nexus HP',            effect: { type: 'cursed_gold', amount: 30, nexusDmg: 1 } },
        { label: 'Offer a Card',    desc: 'Remove 1 random card → +22 gold',      effect: { type: 'remove_random_add_gold', amount: 22 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'dawn_epiphany', title: 'Dawn Epiphany', icon: '🌄',
      flavor: 'The first light of dawn illuminates forgotten tactics, written in golden fire.',
      choices: [
        { label: 'Read the Fire',   desc: 'Add 2 Common cards to your deck',      effect: { type: 'add_cards', count: 2, rarity: 'common' } },
        { label: 'Embrace the Sun', desc: 'Add 1 Rare card to your deck',         effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'invest_gold', title: 'Golden Investment', icon: '📈',
      flavor: 'A solar banker offers to multiply your wealth — with interest.',
      choices: [
        { label: 'Invest 10 Gold',  desc: 'Spend 10g → gain 18g next wave clear', effect: { type: 'invest_gold', cost: 10, returnAmount: 18 } },
        { label: 'Skip',            desc: '+8 gold now',                           effect: { type: 'gold', amount: 8 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_resonance', title: 'Solar Resonance', icon: '🔆',
      flavor: 'Solar energy saturates your towers, amplifying their destructive output briefly.',
      choices: [
        { label: 'Channel Resonance', desc: 'All towers +20% damage for next wave',  effect: { type: 'temp_dmg_bonus', mult: 1.20, waves: 1 } },
        { label: 'Store Energy',      desc: 'Add 2 Common cards to your deck',       effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
      dlc: 'solar_dominion',
    },
  ],
  ko: [
    {
      id: 'solar_oracle', title: '태양 신탁', icon: '☀️',
      flavor: '열기 속에서 타오르는 선지자가 나타나 찬란한 파괴의 환상을 제시합니다.',
      choices: [
        { label: '환상 수락', desc: '희귀 Solar 카드 1장을 덱에 추가',   effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '거절',      desc: '+14 골드',                           effect: { type: 'gold', amount: 14 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'sunfire_cache', title: '선파이어 보관함', icon: '🔥',
      flavor: '정교한 황금 상자에서 열기가 뿜어져 나옵니다. 안에 든 재물이 모든 것을 바꿀 수 있습니다.',
      choices: [
        { label: '재물 탈취', desc: '+28 골드, 넥서스 HP 1 감소',         effect: { type: 'cursed_gold', amount: 28, nexusDmg: 1 } },
        { label: '그냥 둬',   desc: '+14 골드 (안전)',                     effect: { type: 'gold', amount: 14 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'holy_shrine', title: '신성한 성소', icon: '⛪',
      flavor: '빛을 발하는 제단이 고대의 빛으로 맥동합니다. 그 축복은 따뜻하고 조건이 없습니다.',
      choices: [
        { label: '치유 기도', desc: '넥서스 HP 1 회복',           effect: { type: 'heal_nexus', amount: 1 } },
        { label: '지식 수령', desc: '언커먼 카드 1장을 덱에 추가', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'radiant_merchant', title: '찬란한 상인', icon: '🏺',
      flavor: '황금 옷을 입은 상인이 등장합니다. 물건들이 영원한 햇빛 속에 반짝입니다.',
      choices: [
        { label: '물건 구경', desc: '언커먼 카드 2장 추가', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '보급품 구매', desc: '+20 골드',           effect: { type: 'gold', amount: 20 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_revelation', title: '태양의 계시', icon: '🌅',
      flavor: '여명이 무서운 선명함으로 밝아옵니다 — 어떤 인간도 그리지 못한 전투의 경로가 보입니다.',
      choices: [
        { label: '환상 포착', desc: '희귀 카드 1장을 덱에 추가',   effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '마음 가다듬기', desc: '언커먼 카드 1장을 덱에 추가', effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'blinding_gale', title: '눈부신 강풍', icon: '💨',
      flavor: '태양풍이 전장을 휩쓸며 진격하는 군단의 방향을 흐트러뜨립니다.',
      choices: [
        { label: '바람 활용', desc: '다음 웨이브 적 이동속도 −30%', effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: '굳건히 서다', desc: '+10 골드',                   effect: { type: 'gold', amount: 10 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_tribute', title: '태양 공물', icon: '💛',
      flavor: '태양은 희생을 요구합니다. 아낌없이 바치면 몇 배로 돌아옵니다.',
      choices: [
        { label: '공물 바치기', desc: '+30 골드, 넥서스 HP 1 감소',       effect: { type: 'cursed_gold', amount: 30, nexusDmg: 1 } },
        { label: '카드 제물', desc: '카드 1장 제거 → +22 골드',           effect: { type: 'remove_random_add_gold', amount: 22 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'dawn_epiphany', title: '새벽의 깨달음', icon: '🌄',
      flavor: '새벽의 첫 빛이 황금 불꽃으로 쓰인 잊혀진 전술을 밝혀냅니다.',
      choices: [
        { label: '불꽃 읽기', desc: '커먼 카드 2장을 덱에 추가',   effect: { type: 'add_cards', count: 2, rarity: 'common' } },
        { label: '태양 포용', desc: '희귀 카드 1장을 덱에 추가',   effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'invest_gold', title: '황금 투자', icon: '📈',
      flavor: '태양 은행가가 당신의 재산을 불려주겠다고 제안합니다 — 이자 포함.',
      choices: [
        { label: '10골드 투자', desc: '10g 지출 → 다음 웨이브 클리어 시 18g 획득', effect: { type: 'invest_gold', cost: 10, returnAmount: 18 } },
        { label: '건너뛰기',    desc: '+8 골드 즉시',                                effect: { type: 'gold', amount: 8 } },
      ],
      dlc: 'solar_dominion',
    },
    {
      id: 'solar_resonance', title: '태양 공명', icon: '🔆',
      flavor: '태양 에너지가 타워에 스며들어 파괴적인 출력을 잠시 증폭시킵니다.',
      choices: [
        { label: '공명 활용', desc: '다음 웨이브 동안 모든 타워 피해 +20%',   effect: { type: 'temp_dmg_bonus', mult: 1.20, waves: 1 } },
        { label: '에너지 저장', desc: '커먼 카드 2장을 덱에 추가',             effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
      dlc: 'solar_dominion',
    },
  ],
};
