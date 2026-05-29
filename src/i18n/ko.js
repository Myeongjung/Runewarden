/** Runewarden — 한국어 (ko) */
import dlcShadowKo from '../dlc/shadow_realm/i18n/ko.js';
import dlcSolarKo  from '../dlc/solar_dominion/i18n/ko.js';

const _BASE_KO = {
  // ── 메인 메뉴 ───────────────────────────────────────
  title:           'RUNEWARDEN',
  subtitle:        '덱을 구성하고, 타워를 배치하고, 살아남아라.',
  btn_new_run:     '▶ 새로운 런 시작',
  btn_codex:       '📖 워든 코덱스',
  btn_how_to_play: '게임 방법',
  btn_replay_tut:  '↩ 튜토리얼 다시보기',
  warden_rank:     '워든 랭크',
  stat_runs:       (n) => `런: ${n}`,
  stat_wins:       (n) => `승리: ${n}`,
  stat_kills:      (n) => `처치: ${n}`,

  // ── Warden 선택 ─────────────────────────────────────
  warden_select_title: '워든을 선택하세요',
  warden_select_sub:   '각 워든은 고유한 시작 덱과 패시브 능력을 가집니다.',
  warden_select_back:  '← 뒤로',
  warden_locked:       (rank) => `랭크 ${rank} 필요`,
  warden_selected:     '✓ 선택됨',
  warden_select_btn:   '▶ 선택',
  passive_label:       '패시브',

  // ── 게임 HUD ────────────────────────────────────────
  hud_wave:  '웨이브',
  hud_gold:  '골드',
  hud_nexus: '넥서스',
  hud_deck:  '덱',
  act_label: (n) => `ACT ${n}`,

  // ── 웨이브 버튼 ─────────────────────────────────────
  btn_start_wave:       '웨이브 시작',
  btn_wave_in_progress: '웨이브 진행 중...',
  btn_start_wave_n:     (n) => `웨이브 ${n} 시작`,

  // ── 상점 ────────────────────────────────────────────
  shop_title:     '워든의 상점',
  shop_subtitle:  '덱에 추가할 카드를 선택하세요.',
  shop_reroll:    '🎲 재진열',
  shop_leave:     '상점 나가기 →',
  shop_rerolls_left: (n) => `${n}회 남음`,
  shop_no_rerolls:   '재진열 불가',
  shop_cant_afford:   (cost) => `✗ ${cost}g 필요`,
  shop_buy:           '✓ 구매',
  shop_after_wave:    (n) => `— 웨이브 ${n} 이후`,
  shop_sold:          '판매됨',
  shop_not_enough_gold: '리롤할 골드가 부족합니다.',
  shop_bought:        (name) => `구매: ${name} (덱+1)`,
  shop_rerolled:      (left) => `상점을 재진열했습니다. (${left}회 남음)`,

  // ── 노드 선택 ────────────────────────────────────────
  node_title:     '경로를 선택하세요',
  node_shop:      '🏪 상점',
  node_event:     '📜 이벤트',
  node_rest:      '🏕️ 휴식',
  node_shop_desc: '워든의 상점을 방문합니다. 카드를 구매하고 재진열할 수 있습니다.',
  node_event_desc:'무작위 이벤트를 만납니다. 위험과 보상이 기다립니다.',
  node_rest_desc: '야영지에서 휴식합니다. 덱에서 카드 1장을 제거할 수 있습니다.',

  // ── 이벤트 ──────────────────────────────────────────
  event_title:    '이벤트',
  event_choose:   '신중하게 선택하세요.',
  event_accept:   '✓ 수락',
  event_decline:  '✗ 거절',
  event_close:    '계속 →',

  // ── 휴식 ────────────────────────────────────────────
  rest_title:     '워든의 휴식',
  rest_subtitle:  '덱에서 카드 1장을 제거하여 전략을 다듬으세요.',
  rest_gold_bonus:'대신 골드 10을 획득합니다',
  rest_close:     '계속 →',
  rest_removed:   (name) => `${name}을(를) 덱에서 제거했습니다.`,
  rest_gold_taken:'골드 10을 받았습니다.',
  rest_deck_min:  '덱이 너무 작아 카드를 제거할 수 없습니다.',

  // ── 일시정지 ─────────────────────────────────────────
  pause_title:    '⚙️ 일시정지',
  btn_resume:     '▶ 재개',
  btn_how_pause:  '📖 게임 방법',
  btn_quit_menu:  '✕ 메인 메뉴로',
  vol_label:      '🔊 볼륨',

  // ── 챌린지 ────────────────────────────────────────────
  challenge_section_title: '⚔️ 챌린지 (선택사항)',
  challenge_xp_bonus:      (n) => `XP +${n}%`,
  challenge_xp_none:       '보너스 없음',
  ch_cat_tower:            '🏰 타워 제한',
  ch_cat_card:             '🃏 카드 제한',
  ch_cat_economy:          '💰 경제 제한',
  ch_cat_run:              '⚔️ 런 조건',
  challenge_cat_tower:     '🏰 타워 제한',
  challenge_cat_card:      '🃏 카드 제한',
  challenge_cat_economy:   '💰 경제 제한',
  challenge_cat_run:       '⚔️ 런 조건',

  ch_archer_only_name: '궁수의 요새',
  ch_archer_only_desc: '궁수 계열 타워만 소환할 수 있습니다.',
  ch_no_frost_name:    '불꽃의 서약',
  ch_no_frost_desc:    '냉기 계열 타워(프로스트 메이지 등)를 사용할 수 없습니다.',
  ch_no_aoe_name:      '단일 공격만',
  ch_no_aoe_desc:      '범위 공격 타워(캐논, 테슬라 코일)를 사용할 수 없습니다.',
  ch_no_spells_name:   '침묵의 런',
  ch_no_spells_desc:   '주문 카드를 사용할 수 없습니다.',
  ch_no_augments_name: '맨손의 워든',
  ch_no_augments_desc: '강화 카드를 사용할 수 없습니다.',
  ch_common_only_name: '평민의 덱',
  ch_common_only_desc: '상점에서 일반(Common) 등급 카드만 구매할 수 있습니다.',
  ch_fixed_deck_name:  '무변의 덱',
  ch_fixed_deck_desc:  '상점에서 카드를 구매할 수 없습니다.',
  ch_poverty_name:     '빈곤 런',
  ch_poverty_desc:     '시작 골드가 10g로 고정됩니다.',
  ch_no_reroll_name:   '단 한 번의 기회',
  ch_no_reroll_desc:   '상점 리롤이 불가능합니다.',
  ch_no_rest_name:     '쉼 없는 행군',
  ch_no_rest_desc:     '휴식 노드를 사용할 수 없습니다.',
  ch_perfect_nexus_name: '완벽한 방어',
  ch_perfect_nexus_desc: '넥서스가 한 번이라도 피격되면 런이 즉시 종료됩니다.',
  ch_auto_shop_name:   '운명의 길',
  ch_auto_shop_desc:   '노드 선택 없이 웨이브 후 자동으로 상점으로 이동합니다.',
  ch_no_event_name:    '질서의 런',
  ch_no_event_desc:    '이벤트 노드를 선택할 수 없습니다.',

  challenge_tower_banned:  '챌린지: 해당 타워 타입은 사용이 제한되어 있습니다.',
  challenge_card_banned:   (type) => `챌린지: ${type} 카드는 사용이 제한되어 있습니다.`,
  challenge_no_reroll:     '리롤 불가 (챌린지)',
  challenge_no_buy:        '🚫 제한됨',
  challenge_node_banned:   '🚫 챌린지로 제한됨',
  challenge_perfect_fail:  '💎 완벽한 방어 실패 — 넥서스가 피격되었습니다!',

  // ── How to Play ──────────────────────────────────────
  howto_title:    '게임 방법',
  howto_close:    '알겠습니다!',
  howto_1:        '<b>소환 카드</b> — 카드를 클릭한 후 빈 헥스를 클릭하여 타워를 배치합니다.',
  howto_2:        '<b>강화 카드</b> — 카드를 클릭한 후 기존 타워를 클릭하여 업그레이드합니다.',
  howto_3:        '<b>주문 카드</b> — 카드를 클릭하면 즉시 발동됩니다.',
  howto_4:        '타워는 적을 자동으로 공격합니다. 적이 출구에 도달하지 못하게 하세요!',
  howto_5:        '<b>넥서스 HP</b>를 모두 잃으면 런이 종료됩니다.',
  howto_6:        '⚡ <b>격노</b> — 일부 적은 <b>HP가 낮으면 급격히 빨라집니다.</b> (광전사, 공허 추적자, 콜로서스) 빠르게 처치하세요!',
  howto_7:        '🛡️ <b>피해 감소</b> — 페스트 캐리어, 팬텀은 피해를 적게 받습니다. 여러 타워로 공략하세요.',
  howto_8:        '🧊 <b>슬로우 면역</b> — 저거넛, 공성 야수, 스톤 골렘은 <b>감속이 통하지 않습니다.</b> 순수 데미지로 처치하세요.',

  howto_shortcuts_title: '⌨️ 키보드 단축키',
  howto_shortcuts_body:  `
    <div class="shortcut-grid">
      <div class="sc-row"><kbd>Enter</kbd><span>새 런 시작 (메인 메뉴)</span></div>
      <div class="sc-row"><kbd>C</kbd><span>이어하기 (메인 메뉴)</span></div>
      <div class="sc-row"><kbd>Space</kbd><span>웨이브 시작</span></div>
      <div class="sc-row"><kbd>1</kbd>–<kbd>5</kbd><span>카드 선택 / 사용</span></div>
      <div class="sc-row"><kbd>F</kbd><span>카드 선택 취소</span></div>
      <div class="sc-row"><kbd>D</kbd><span>덱 보기 (웨이브 전 전용)</span></div>
      <div class="sc-row"><kbd>Tab</kbd><span>2배속 토글 (웨이브 중)</span></div>
      <div class="sc-row"><kbd>Esc</kbd><span>일시정지 / 창 닫기</span></div>
      <div class="sc-row"><kbd>1</kbd>–<kbd>3</kbd><span>노드 · 상점 · 이벤트 선택</span></div>
      <div class="sc-row"><kbd>R</kbd><span>상점 리롤 / 재시작</span></div>
      <div class="sc-row"><kbd>L</kbd><span>상점 나가기</span></div>
      <div class="sc-row"><kbd>M</kbd><span>음소거 (일시정지 중)</span></div>
      <div class="sc-row"><kbd>Q</kbd><span>메뉴로 나가기 (일시정지 중)</span></div>
    </div>`,

  // ── 게임 오버 / 승리 ─────────────────────────────────
  gameover_title_win:  '🏆 승리!',
  gameover_title_lose: '런 종료',
  gameover_win_msg:    (waves) => `${waves}웨이브를 클리어했습니다. 넥서스를 지켜냈습니다!`,
  gameover_lose_msg:   (waves) => `넥서스가 무너지기 전 ${waves}웨이브까지 도달했습니다.`,
  btn_play_again:      '다시 플레이',
  btn_main_menu:       '메인 메뉴',

  // ── 런 로그 메시지 ───────────────────────────────────
  log_run_start:    (warden) => `${warden} — 새 런을 시작합니다!`,
  log_wave_start:   (n, act)  => `웨이브 ${n} 시작! (Act ${act})`,
  log_wave_clear:   (n, gold) => `웨이브 ${n} 클리어! +${gold} 골드`,
  log_boss_wave:    (name)    => { const BOSS_KO = { 'Ironclad': '철갑 수호자', 'Void Titan': '공허의 거인', 'Abyssal Dragon': '심연의 용', 'Shadow Colossus': '그림자 거신', 'Sun God': '태양신' }; return `⚠️ 보스 웨이브! ${BOSS_KO[name] ?? name}이 다가옵니다!`; },
  log_boss_weakness: (name, type) => { const BOSS_KO = { 'Ironclad': '철갑 수호자', 'Void Titan': '공허의 거인', 'Abyssal Dragon': '심연의 용', 'Shadow Colossus': '그림자 거신', 'Sun God': '태양신' }; return `🔍 ${BOSS_KO[name] ?? name}의 이번 런 약점: ${type}! (+50% 피해)`; },
  weakness_fire:      '🔥 화염',
  weakness_frost:     '❄️ 서리',
  weakness_lightning: '⚡ 번개',
  weakness_shadow:    '🌑 그림자',
  weakness_solar:     '☀️ 태양',
  log_victory_streak_start: (n) => `✨ 보스 처치! 다음 ${n}웨이브 동안 승전 보너스 적용.`,
  log_victory_streak:       (g, n) => n > 0 ? `✨ 승전 보너스: +${g}g (${n}웨이브 남음)` : `✨ 승전 보너스: +${g}g`,
  log_nexus_hit:    (hp)      => `적이 넥서스에 도달했습니다! (${hp} HP 남음)`,
  log_enemy_adapted: (name) => `⚠️ ${name}이(가) 적응했습니다 — 다음 웨이브에서 10% 빨라집니다!`,
  log_card_placed:  (name, c, r) => `${name} 배치 완료 (${c},${r})`,
  log_not_enough_gold: (need, have) => `골드 부족! (필요: ${need}, 보유: ${have})`,

  // ── 카드 타입 ────────────────────────────────────────
  card_type_summon:  '소환',
  card_type_augment: '강화',
  card_type_spell:   '주문',
  card_type_curse:   '저주',
  card_surcharge:    '+1 추가 비용',
  card_free:         '무료',

  // ── Balance Sync #10: 저주 카드 + Cursed Wave + 엔레이지 경보 ─
  log_curse_unplayable:   '저주 카드는 플레이할 수 없습니다.',
  log_curse_regret:       (name) => `후회가 ${name}을(를) 버렸습니다!`,
  log_cursed_bargain:     '💀 어두운 계약이 당신의 덱을 오염시킵니다…',
  log_cursed_wave_speed:  '⚠️ 저주받은 웨이브: 적 이동속도 35% 증가!',
  log_cursed_wave_hand:   '⚠️ 저주받은 웨이브: 이번 웨이브 손패 -2!',
  log_cursed_wave_revive: '⚠️ 저주받은 웨이브: 엘리트가 HP 30%로 부활합니다!',
  log_enrage_imminent:    (name) => `⚠️ ${name}: 폭주 임박!`,

  // ── 유물 시스템 ──────────────────────────────────────
  relic_pick_title:     '유물을 선택하세요',
  relic_pick_sub:       '선택한 유물은 이번 런 전체에 걸쳐 효과를 발휘합니다.',
  rarity_common:        '일반',
  rarity_uncommon:      '고급',
  rarity_rare:          '희귀',

  // 유물 이름 & 설명
  relic_whetstone:              '숫돌',
  relic_whetstone_desc:         '궁수 타워 피해 +30%.',
  relic_blast_powder:           '폭발 화약',
  relic_blast_powder_desc:      '대포 타워 범위 피해 반경 +40%.',
  relic_ember_core:             '화염 핵',
  relic_ember_core_desc:        '화염 드레이크의 번 효과가 초당 +4 피해, 0.8초 더 지속됩니다.',
  relic_static_coil:            '정전기 코일',
  relic_static_coil_desc:       '테슬라 코일이 1명의 적을 추가로 체인합니다.',
  relic_ancient_bark:           '고대 나무껍질',
  relic_ancient_bark_desc:      '드루이드 그로브 버프가 +10% 추가됩니다 (총 +25%).',
  relic_merchants_badge:        '상인의 배지',
  relic_merchants_badge_desc:   '웨이브 클리어 시마다 골드 +3 추가 획득.',
  relic_gold_lens:              '황금 렌즈',
  relic_gold_lens_desc:         '상점 카드 비용이 1g 감소합니다 (최소 1g).',
  relic_lucky_coin:             '행운의 동전',
  relic_lucky_coin_desc:        '골드 5g 이상 보유 시 이자 획득 (기본: 10g).',
  relic_war_chest:              '전쟁 상자',
  relic_war_chest_desc:         '런 시작 시 골드 +10 추가.',
  relic_bounty_mark:            '현상금 표식',
  relic_bounty_mark_desc:       '적 처치 시마다 골드 +1 추가.',
  relic_aegis_fragment:         '아이기스 파편',
  relic_aegis_fragment_desc:    '넥서스 HP +1로 시작.',
  relic_soul_anchor:            '영혼 닻',
  relic_soul_anchor_desc:       '첫 번째로 넥서스에 도달한 적은 피해를 주지 않습니다. (런당 1회)',
  relic_frost_ward:             '서리 수호',
  relic_frost_ward_desc:        '모든 감속 효과가 25% 강화됩니다.',
  relic_swift_quiver:           '신속 화살통',
  relic_swift_quiver_desc:      '각 웨이브 시작 시 카드 1장을 추가로 드로우합니다.',
  relic_arcane_focus:           '비전 집중',
  relic_arcane_focus_desc:      '테슬라 코일의 공격 속도가 25% 빨라집니다.',

  // 유물 이름 & 설명 (신규 10개)
  relic_venom_fang:             '독 이빨',
  relic_venom_fang_desc:        '적 처치 시 주변의 무작위 적에게 15 독 피해를 입힙니다.',
  relic_siege_engine:           '공성 엔진',
  relic_siege_engine_desc:      '대포 타워의 폭발 반경이 +60% 증가합니다.',
  relic_merchants_ring:         '상인의 반지',
  relic_merchants_ring_desc:    '매 상점 방문 시 첫 번째 리롤은 무료입니다.',
  relic_savings_bond:           '저축 채권',
  relic_savings_bond_desc:      '이자가 발생할 때마다 추가로 +2 골드를 획득합니다.',
  relic_iron_fortress:          '철옹성',
  relic_iron_fortress_desc:     '웨이브당 넥서스는 최대 1회만 피해를 입을 수 있습니다.',
  relic_thorn_wall:             '가시 장벽',
  relic_thorn_wall_desc:        '넥서스가 피격될 때 가장 가까운 적에게 25 피해를 입힙니다.',
  relic_fire_pact:              '화염 협약',
  relic_fire_pact_desc:         '화염 드레이크 타워가 2개 이상 활성화되면 데미지가 +25% 증가합니다.',
  relic_storm_circuit:          '폭풍 회로',
  relic_storm_circuit_desc:     '주문 시전 후 모든 테슬라 코일이 즉시 한 번 발사합니다.',
  relic_wardens_sigil:          '워든의 문장',
  relic_wardens_sigil_desc:     '웨이브 클리어 후 카드 2장을 즉시 핸드에 드로우합니다.',
  relic_blood_price:            '피의 대가',
  relic_blood_price_desc:       '넥서스 HP 1을 희생하여 즉시 +20 골드를 획득합니다.',
  relic_keen_eye:               '날카로운 눈',
  relic_keen_eye_desc:          '모든 타워가 위장(Camo) 적을 감지하고 공격할 수 있습니다.',

  // ── 시너지 이름 / 설명 ───────────────────────────────
  synergy_merchant_king:        '상인 왕',
  synergy_merchant_king_desc:   '상인의 배지 + 현상금 마크: 3웨이브마다 +5g.',
  synergy_inferno_pact:         '인페르노 협약',
  synergy_inferno_pact_desc:    '화염 코어 + 화염 서약: 번(DoT)이 +4 추가 DPS.',
  synergy_thunder_surge:        '천둥 폭발',
  synergy_thunder_surge_desc:   '정전기 코일 + 폭풍 회로: Tesla가 1개 더 체인.',
  synergy_iron_citadel:         '철의 성채',
  synergy_iron_citadel_desc:    '방패 파편 + 가시 장벽: 가시 반격 피해 ×1.5.',
  synergy_void_surge:           '공허 폭발',
  synergy_void_surge_desc:      '공허 코어 + 공허 에코: Void Echo 쿨다운 절반.',
  synergy_solar_ascendancy:     '태양 패권',
  synergy_solar_ascendancy_desc:'태양 협약 + 눈부신 부적: 감속 효과 +15% 강화.',

  log_synergy_active:       (icon, name) => `✨ 시너지 발동: ${icon} ${name}!`,
  log_synergy_wave_gold:    (icon, name, amt) => `${icon} ${name}: +${amt}g`,

  // 유물 로그 메시지
  log_relic_picked:     (name) => `유물 획득: ${name}`,
  log_soul_anchor:      '영혼 닻이 피격을 흡수했습니다! 넥서스 보호.',
  log_interest:         (n) => `이자: +${n} 골드.`,
  log_iron_fortress:    '철옹성! 넥서스 보호 — 이번 웨이브 추가 피격 차단.',
  log_thorn_wall:       (dmg) => `가시 장벽! 가장 가까운 적에게 ${dmg} 피해 반사.`,
  log_venom_fang:       (dmg) => `독 이빨! 주변 적에게 ${dmg} 독 피해.`,
  log_wave_draw:        (n) => `워든의 문장! 카드 ${n}장 추가 드로우.`,
  log_storm_circuit:    (n) => `폭풍 회로! 테슬라 코일 ${n}개 즉시 발사!`,
  log_blood_price:      (g) => `피의 대가: 넥서스 HP 1 희생, +${g} 골드 획득.`,
  log_savings_bond:     (n) => `저축 채권: 이자 +${n} 추가 골드.`,
  log_free_reroll:      '무료 리롤! (상인의 반지)',
  log_camo_warn:        '👁️ 위장 적 출현! Marksman 또는 날카로운 눈으로만 감지 가능합니다.',

  // ── 난이도 ────────────────────────────────────────────
  difficulty_title:     '난이도 선택',
  difficulty_sub:       '이번 런의 도전 강도를 선택하세요.',
  diff_novice:          '초보자',
  diff_standard:        '표준',
  diff_veteran:         '베테랑',
  diff_novice_desc:     '넥서스 HP 5 · 완만한 스케일링 · 시작 골드 +5 · 웨이브 보상 +1g',
  diff_standard_desc:   '넥서스 HP 3 · 균형 잡힌 도전 · 기본 설정',
  diff_veteran_desc:    '넥서스 HP 2 · 빠른 스케일링 · 골드 감소 · 엘리트 강화',
  diff_confirm:         '▶ 런 시작',
  diff_back:            '← 뒤로',
  log_difficulty:       (name) => `난이도: ${name}`,

  // ── 노드 힌트 뱃지 ───────────────────────────────────
  node_hint_economy:  '경제',
  node_hint_mystery:  '신비',
  node_hint_rest:     '회복',

  // ── 경로 분기 ────────────────────────────────────────
  path_fork_title:     (act) => `Act ${act} 클리어 — 경로를 선택하세요`,
  path_fork_sub:       '이 선택이 앞으로의 흐름을 결정합니다.',
  path_safe:           '안전 경로',
  path_safe_desc:      '상점, 이벤트, 휴식 중 자유롭게 선택합니다. 패널티 없는 표준 진행.',
  path_safe_tag:       '🏰 안정적',
  path_gamble:         '도박 경로',
  path_gamble_desc:    '+15 골드와 랜덤 유물 1개를 즉시 획득하지만, 50% 확률로 저주 카드가 덱에 추가됩니다.',
  path_gamble_tag:     '🎲 고위험 / 고보상',
  log_gamble_gold:     '🎲 도박 경로 선택: +15 골드!',
  log_gamble_relic:    (name) => `🎲 용기에 행운이 따릅니다! 유물 획득: ${name}`,
  log_gamble_curse:    '💀 도박의 대가 — 저주 카드가 덱에 추가되었습니다.',
  log_gamble_no_curse: '✨ 운이 따릅니다 — 이번엔 저주 없음.',

  // ── 기습 ────────────────────────────────────────────
  banner_ambush:      '⚠️ 기습! 지원군이 몰려옵니다!',
  log_ambush_warn:    (n) => `⚠️ 기습! ${n}마리의 추가 적이 5초 후 등장합니다!`,

  // ── 자동저장 ─────────────────────────────────────────
  btn_continue:       (wave, icon, map) => `↩ 계속하기 — ${icon} ${map} (웨이브 ${wave})`,
  autosave_loaded:    (wave) => `웨이브 ${wave}부터 런을 이어갑니다. 워든, 힘내세요!`,

  // ── 워든 패시브 설명 ──────────────────────────────────
  passive_stalwart_desc:    '특수 효과 없음. 메타 보너스를 온전히 받는다.',
  passive_bloodlust_desc:   '적 처치 시 골드 +1 추가. (탱크 +1, 엘리트 +1, 보스 +5)',
  passive_arcane_flow_desc: '모든 주문 카드 코스트 -1 (최소 0). 웨이브 중 추가 비용도 1 감소.',
  passive_grave_gold_desc:  '웨이브 종료 시 버린 카드 1장당 골드 +1을 획득합니다.',
  passive_grave_gold_trigger: (n) => `무덤의 황금: 버린 카드 ${n}장 → +${n} 골드.`,

  // ── 노드 선택 (추가) ────────────────────────────────
  node_after_wave:     (n) => `— 웨이브 ${n} 이후 —`,
  node_gold_display:   (g) => `💰 ${g} 골드`,
  node_merchant:       '상인',
  node_unknown:        '미지',
  node_sanctuary:      '성역',
  node_shop_desc2:     '덱에 카드를 추가하세요. 재진열 2회 가능.',
  node_event_desc2:    '무작위 조우가 어려운 선택을 제시합니다.',
  node_rest_desc2:     '덱을 다듬거나 자원을 회복하세요.',

  // ── 휴식 (추가) ─────────────────────────────────────
  rest_site:           '휴식 장소',
  rest_subtitle2:      '잠시 회복하거나 덱을 다듬으세요.',
  rest_remove_card:    '카드 제거',
  rest_remove_desc:    '덱에서 카드 1장을 영구 제거합니다 (무료).',
  rest_scavenge:       '수색',
  rest_scavenge_desc:  (g) => `주변을 수색합니다. 골드 ${g}를 획득합니다.`,
  rest_choose_card:    '제거할 카드를 선택하세요:',
  rest_cancel:         '취소',
  rest_leave:          '떠나기 →',
  rest_deck_empty:     '덱이 비어 있습니다!',
  rest_scavenged:      (g) => `주변을 수색했습니다. +${g} 골드.`,
  rest_forge:          '단조',
  rest_forge_desc:     '덱의 카드 1장을 영구 강화합니다 (무료).',
  rest_forge_choose:   '단조할 카드를 선택하세요:',
  rest_forge_empty:    '단조 가능한 카드가 없습니다.',
  rest_forge_cost:     '비용',
  rest_forge_btn:      '단조',
  rest_forged:         (name) => `${name} 단조 완료!`,
  card_btn_remove:     '제거',
  event_log:           (title, label) => `[${title}] ${label}`,

  // ── 런 요약 ─────────────────────────────────────────
  summary_victory:        '승리!',
  summary_defeat:         '넥서스 붕괴',
  summary_victory_sub:    '워든이 지켜냈습니다!',
  summary_defeat_sub:     (n) => `웨이브 ${n}에서 쓰러졌습니다`,
  stat_waves_cleared:     '웨이브 클리어',
  stat_enemies_slain:     '적 처치',
  stat_gold_earned:       '획득 골드',
  stat_cards_played:      '카드 플레이',
  rank_label:             '워든 랭크',
  xp_gained:              (n) => `+${n} XP`,
  rank_num:               (n) => `랭크 ${n}`,
  max_rank:               '최고 랭크',
  lifetime_runs:          (n) => `총 런: ${n}`,
  lifetime_wins:          (n) => `승리: ${n}`,
  lifetime_kills:         (n) => `총 처치: ${n}`,
  unlock_label:           (title, rank) => `🔓 ${title}  랭크 ${rank}`,

  // ── Codex ────────────────────────────────────────────
  codex_max_rank:         '최고 랭크 달성',
  codex_xp_to:            (xp, rank) => `랭크 ${rank}까지 ${xp} XP`,
  codex_stat_runs:        '런',
  codex_stat_wins:        '승리',
  codex_stat_slain:       '처치한 적',
  codex_stat_winrate:     '승률',
  codex_unlocked:         (rank) => `✓ 랭크 ${rank}`,
  codex_locked:           (rank) => `랭크 ${rank} 필요`,

  // ── 게임 인게임 로그 (추가) ──────────────────────────
  log_tutorial_done:      '튜토리얼 완료! 준비되었습니다, 워든.',
  log_select_summon:      (name) => `선택: ${name}. 지도의 빈 헥스를 클릭하세요.`,
  log_select_augment:     (name) => `선택: ${name}. 지도의 타워를 클릭하세요.`,
  log_cannot_place:       '여기에 배치할 수 없습니다.',
  log_tower_exists:       '이미 타워가 있습니다.',
  log_no_tower:           '강화할 타워가 없습니다.',
  log_max_augments:       '타워가 이미 최대 강화에 도달했습니다.',
  log_tower_sold:         (name, g) => `${name}를 ${g}g에 매각했습니다.`,
  tower_sell_value:       (g) => `${g}g에 매각 (50%)`,
  tower_sell_aug:         '강화',
  tower_sell_btn:         '타워 매각',
  tower_sell_cancel:      '취소',
  log_nexus_healed:       (hp) => `넥서스 HP 회복! (${hp} HP 남음)`,
  log_nexus_full:         '넥서스는 이미 최대 HP입니다.',
  log_no_targets:         '체인 볼트의 대상이 없습니다.',
  log_prepare_wave:       (n) => `웨이브 ${n}을 대비하세요!`,
  log_shop_closed:        '상점을 닫았습니다.',
  log_run_begin:          '새 런이 시작됩니다. 카드를 드로우하고 타워를 배치하세요!',
  log_surcharge:          (cost, extra) => extra > 1
    ? `웨이브 중 +${extra} 골드 추가 비용 (어센션 III). ${cost} 골드 필요.`
    : `웨이브 중 +1 골드 추가 비용. ${cost} 골드 필요.`,
  log_nexus_cursed:       (hp) => `넥서스가 피해를 받았습니다! ${hp} HP 남음.`,
  log_cards_added:        (n, r) => `${r} 카드 ${n}장을 덱에 추가했습니다.`,
  log_wave_slow:          '다음 웨이브 적들이 더 느리게 이동합니다.',
  log_extra_prep:         (s) => `다음 웨이브 준비 시간 +${s}초.`,
  log_card_removed_rand:  (name) => `덱에서 ${name}을(를) 제거했습니다.`,
  log_nothing:            '아무 일도 일어나지 않았습니다. 신중함이 지혜입니다.',
  log_augmented:          (stat, mult) => { const STAT_KO = { damage: '공격력', range: '사거리', attackSpeed: '공격 속도', slow: '감속' }; return `타워 강화: ${STAT_KO[stat] ?? stat} ×${mult}`; },

  // ── 주문 로그 ────────────────────────────────────────
  spell_gold:             (n) => `+${n} 골드!`,
  spell_freeze:           '눈보라! 모든 적이 얼었습니다.',
  spell_damage_all:       (n) => `모든 적에게 ${n} 피해!`,
  spell_slow_all:         (pct, s) => `지진! 모든 적이 ${s}초 동안 ${pct}% 감속됩니다.`,
  spell_lightning:        (count, n) => `번개가 무작위 적 ${count}명에게 ${n} 피해를 줍니다!`,
  spell_chain_bolt_hit:   (d, c, cd) => `체인 볼트! ${d} + ${cd}×${c} 연쇄 피해.`,
  spell_chain_bolt_miss:  '체인 볼트의 대상이 없습니다.',
  spell_nexus_heal:       '자연의 자비! 넥서스 HP가 회복되었습니다.',
  spell_draw:             (n) => `마나 서지! 추가 카드 ${n}장을 드로우했습니다.`,
  spell_speed_boost:      (mult, s) => `시간 왜곡! 모든 타워가 ${s}초 동안 ${mult}배 속도로 공격합니다!`,
  spell_dmg_boost:        (mult, s) => `파워 서지! 모든 타워가 ${s}초 동안 ×${mult} 피해를 줍니다!`,
  spell_nova:             (d, pct, s) => `아케인 노바! 모든 적에게 ${d} 피해 + ${pct}% 감속!`,
  spell_gold_draw:        (g, n) => `수색! +${g} 골드, 카드 ${n}장 드로우.`,
  spell_tower_rally:      '타워 집결! 모든 타워가 즉시 발사합니다!',
  spell_soul_harvest:     (n) => `영혼 수확! 적 ${n}마리로부터 ${n} 골드 획득.`,
  spell_no_enemies:       '필드에 적이 없습니다.',
  spell_nature_cycle:     '자연의 순환! 패를 교체했습니다 — 새 카드 5장 드로우.',
  spell_rally_cry:        (pct, s) => `결전의 함성! 모든 타워 +${pct}% 피해, 공격속도 60% 증가 ${s}초!`,
  spell_ice_storm:        (d, pct, s) => `얼음 폭풍! 모든 적에게 ${d} 피해 + ${pct}% 감속 ${s}초!`,
  spell_void_bolt:        (d) => `허공의 볼트! 선두 적에게 ${d} 피해.`,
  spell_crimson_tide:     (d) => `붉은 파도! 모든 적에게 ${d} 피해!`,
  spell_arcane_storm:     (n, d) => `비전 폭풍! ${n}마리의 적에게 ${d} 피해!`,
  spell_mass_slow:        (pct, s) => `진흙탕! 모든 적이 ${s}초 동안 ${pct}% 감속됩니다.`,
  spell_overdrive:        (s) => `오버드라이브! 모든 타워가 ${s}초 동안 3배 속도로 공격합니다!`,
  spell_needle:           (d) => `바늘 볼트! 선두 적에게 ${d} 피해.`,
  spell_chain_storm:      (n, d) => `체인 폭풍! ${n}명의 적에게 ${d} 피해!`,
  spell_warden_call:      (n) => `워든의 호출! 카드 ${n}장 드로우.`,
  spell_time_stop:        (s) => `시간 정지! 모든 적이 ${s}초 동안 얼었습니다!`,
  spell_cryowave:         (d, s) => `냉기파! ${d} 피해 + 모든 적이 ${s}초 동안 얼었습니다!`,
  spell_void_rift:        '공허 균열! 모든 적이 스폰 지점으로 순간이동했습니다!',
  spell_ember_rain:       (d, pct, s) => `화염 비! 모든 적에게 ${d} 피해 + ${pct}% 감속!`,
  spell_life_tap:         (g, n) => `생명 흡수! +${g} 골드, 카드 ${n}장 드로우.`,

  // ── v1.2 Shadow Warden 스펠 로그 ─────────────────────
  spell_soul_drain:       (d, k) => k > 0 ? `영혼 흡수! ${d} 피해. 처치 ${k}마리 → +${k} 골드!` : `영혼 흡수! 모든 적에게 ${d} 피해.`,
  spell_grave_call:       (n) => `무덤의 호출! 버림 덱에서 카드 ${n}장 회수.`,
  spell_entropy:          (pct, total) => `엔트로피! 현재 HP의 ${pct}% 피해 — 총 ${total} 피해!`,
  spell_dark_matter:      (d) => `암흑 물질! 가장 강력한 적에게 ${d} 피해!`,
  spell_void_echo:        (_type) => `허공의 메아리! 직전 주문을 반복 시전합니다.`,
  spell_void_echo_empty:  '허공의 메아리: 아직 반복할 주문이 없습니다.',
  spell_sacrifice:        (n, g) => n > 0 ? `어둠의 희생! 카드 ${n}장 버림 → +${g} 골드.` : '어둠의 희생! 핸드가 비어 있습니다.',
  spell_no_discard:       '버림 덱이 비어 있습니다. 회수할 카드가 없습니다.',
  spell_decay:            (pct, s) => `부식! 모든 적이 ${s}초 동안 ${pct}% 감속됩니다.`,

  // ── 카드 핸드 ────────────────────────────────────────
  hand_label:             '패',
  hand_empty:             '패에 카드가 없습니다.',
  card_surcharge_label:   '+1 추가 비용',

  // ── 배너 ─────────────────────────────────────────────
  banner_boss_act:        (act) => `ACT ${act} — 보스 웨이브`,
  banner_boss_ironclad:        '철갑 수호자가 접근합니다!',
  banner_boss_titan:           '공허의 거인이 깨어납니다!',
  banner_boss_dragon:          '심연의 용이 강림합니다!',
  banner_boss_shadow_colossus: '그림자 거신이 강림합니다!',
  banner_boss_solar_titan:     '태양의 거인이 솟아오릅니다!',
  banner_boss_sun_god:         '태양신이 강림합니다!',

  boss_hud_ironclad:        '철갑 수호자',
  boss_hud_void_titan:      '공허의 거인',
  boss_hud_abyssal_dragon:  '심연의 용',
  boss_hud_shadow_titan:    '그림자 타이탄',
  boss_hud_shadow_colossus: '그림자 거신',
  boss_hud_solar_titan:     '태양의 거인',
  boss_hud_sun_god:         '태양신',
  boss_hud_phase2:          ' — 페이즈 2',
  banner_act_clear:       (act) => `✨ ACT ${act} 클리어 ✨`,
  banner_act_next:        (act) => `ACT ${act} 준비`,
  banner_victory:         '🏆 승리! 🏆',
  banner_all_clear:       '모든 액트 클리어',
  banner_wave_clear:      (n) => `웨이브 ${n} 클리어!`,
  banner_entering_shop:   '상점 입장',
  banner_unlock:          '🔓',

  // ── 공통 ─────────────────────────────────────────────
  free:              '무료',
  gold_unit:         'g',
  loading:           '로딩 중...',
  version:           (v) => `v${v}`,

  // ── Ascension Mode ───────────────────────────────────
  asc_section_title:  '⚡ 어센션 모드',
  asc_section_sub:    '랭크 20 달성. 난이도 위에 추가 핸디캡을 레이어로 쌓습니다.',
  asc_off:            '해제',
  asc_off_desc:       '기본 규칙 적용. 추가 핸디캡 없음.',
  asc_1_title:        '어센션 I',
  asc_1_desc:         '상점에서 카드가 2장만 표시됩니다.',
  asc_2_title:        '어센션 II',
  asc_2_desc:         '이자 시스템 비활성화. 골드를 써야만 성장할 수 있습니다.',
  asc_3_title:        '어센션 III',
  asc_3_desc:         '웨이브 중 카드 추가 비용이 +2g으로 증가합니다.',
  asc_locked:         (n) => `어센션 ${n - 1} 클리어 후 해금`,
  asc_cleared:        (n) => `🏆 어센션 ${n} 클리어! 새 레벨이 해금됐습니다.`,
  asc_new_record:     (n) => `🔓 어센션 ${n} 해금!`,
  log_ascension:      (n) => `어센션 ${n} 활성화 — 행운을 빕니다, 워든이여.`,
  log_asc_cleared:    (n) => `어센션 ${n} 완료! 어센션 ${n + 1}이(가) 해금됐습니다.`,
  log_asc_all_clear:  '모든 어센션 레벨 정복! 당신은 최강의 워든입니다.',

  // ── 튜토리얼 ─────────────────────────────────────────
  tut_welcome_title: '환영합니다, 워든이여!',
  tut_welcome_text:  '파도처럼 몰려오는 적들로부터 넥서스를 지켜야 합니다.\n\n<b>카드</b>를 사용해 타워를 소환하고 3개의 웨이브를 살아남으세요.',
  tut_welcome_btn:   '시작하겠습니다!',
  tut_path_title:    '적의 이동 경로',
  tut_path_text:     '적들은 <b style="color:#ff8888">붉게 표시된 경로</b>를 따라 스폰 지점에서 출구로 이동합니다.\n\n넥서스는 ♥♥♥입니다. 적 3마리가 출구에 도달하면 게임 오버!',
  tut_path_btn:      '알겠습니다',
  tut_green_title:   '최적 타워 위치',
  tut_green_text:    '<b style="color:#4caf50">초록색 셀</b>이 보이시나요? 경로에 인접한 셀입니다.\n\n<b>여기에 타워를 배치</b>하면 최대 커버리지를 확보할 수 있습니다!',
  tut_green_btn:     '알겠습니다',
  tut_select_title:  '카드 선택',
  tut_select_text:   '<b>🏹 궁수 타워</b> 카드를 클릭하여 선택하세요.\n\n선택된 카드는 금색으로 빛납니다.',
  tut_place_title:   '타워 배치',
  tut_place_text:    '이제 맵의 <b style="color:#4caf50">초록색 셀</b>을 클릭하여 궁수 타워를 배치하세요.',
  tut_wave_title:    '웨이브 시작!',
  tut_wave_text:     '잘하셨습니다! 골드가 있다면 타워를 더 배치한 후 <b>웨이브 시작</b>을 클릭하세요.',
  tut_combat_title:  '타워가 공격합니다!',
  tut_combat_text:   '타워는 <b>자동으로</b> 적을 공격합니다.\n\n전투를 지켜보세요 — 적들은 HP 바가 있으며 파티클 이펙트와 함께 사라집니다!',
  tut_combat_btn:    '멋지네요!',
  tut_hud_title:     '상태 확인',
  tut_hud_text:      '<b>웨이브</b> — 현재 / 전체 웨이브\n<b>골드</b> — 카드 및 업그레이드에 사용\n<b>넥서스 ♥♥♥</b> — 모두 잃으면 런 종료',
  tut_hud_btn:       '알겠습니다',
  tut_done_title:    '🏆 준비 완료, 워든이여!',
  tut_done_text:     '웨이브 클리어 후 경로를 선택하세요:\n• <b>🏪 상점</b> — 새 카드 구매\n• <b>⚡ 이벤트</b> — 무작위 선택지\n• <b>🛌 휴식</b> — 카드 제거 또는 골드 획득\n\n행운을 빕니다. 넥서스가 당신을 필요로 합니다.',
  tut_done_btn:      '시작!',
  tut_waiting:        '행동을 기다리는 중…',
  tut_manual_advance: '직접 진행',
  tut_skip:           '튜토리얼 건너뛰기',
  tut_hint_select:   '튜토리얼: 핸드에서 궁수 타워 카드를 선택하세요.',
  tut_hint_place:    '튜토리얼: 경로 근처의 초록색 셀을 클릭하세요.',
  tut_hint_wave:     '튜토리얼: 준비가 되면 웨이브 시작을 클릭하세요!',

  // ── 런 요약 (맵·난이도 표시) ────────────────────────
  summary_map:       '맵',
  summary_difficulty:'난이도',

  // ── 이벤트 데이터 (한국어) ───────────────────────────
  events: [
    {
      id: 'merchants_gift', title: '상인의 선물', icon: '🎁',
      flavor: '여행 상인이 잉여 물품을 제공합니다.',
      choices: [
        { label: '골드 받기',      desc: '+10 골드',                       effect: { type: 'gold', amount: 10 } },
        { label: '카드 받기',      desc: '덱에 무작위 일반 카드 2장 추가', effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
    },
    {
      id: 'ancient_tome', title: '고대 마법서', icon: '📖',
      flavor: '잊혀진 주문들로 가득 찬 페이지들이 희미하게 빛납니다.',
      choices: [
        { label: '연구하기',       desc: '덱에 무작위 희귀 카드 1장 추가', effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '팔기',           desc: '+12 골드',                       effect: { type: 'gold', amount: 12 } },
      ],
    },
    {
      id: 'cursed_relic', title: '저주받은 유물', icon: '💀',
      flavor: '힘에는 언제나 대가가 따릅니다.',
      choices: [
        { label: '저주 수용',      desc: '+18 골드, 넥서스 HP 1 감소',     effect: { type: 'cursed_gold', amount: 18, nexusDmg: 1 } },
        { label: '내버려두기',     desc: '아무 일도 일어나지 않습니다',    effect: { type: 'nothing' } },
      ],
    },
    {
      id: 'mysterious_fog', title: '신비로운 안개', icon: '🌫️',
      flavor: '공기가 짙어집니다. 적들이 안개 속에서 비틀거립니다.',
      choices: [
        { label: '안개 활용',      desc: '다음 웨이브 적 속도 -25%',       effect: { type: 'slow_next_wave', amount: 0.25 } },
        { label: '태워 없애기',    desc: '+6 골드',                        effect: { type: 'gold', amount: 6 } },
      ],
    },
    {
      id: 'fallen_knight', title: '쓰러진 기사', icon: '⚔️',
      flavor: '전사의 마지막 선물이 전장에 놓여 있습니다.',
      choices: [
        { label: '검 가져가기',    desc: '무작위 고급 카드 1장 추가',      effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
        { label: '방패 가져가기',  desc: '+8 골드',                        effect: { type: 'gold', amount: 8 } },
      ],
    },
    {
      id: 'war_cache', title: '전쟁 비축품', icon: '📦',
      flavor: '마지막 공성 이후 손대지 않은 매장된 상자.',
      choices: [
        { label: '골드 가져가기',  desc: '+15 골드',                       effect: { type: 'gold', amount: 15 } },
        { label: '보급품 가져가기', desc: '무작위 일반 카드 3장 추가',     effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'warden_blessing', title: '워든의 축복', icon: '✨',
      flavor: '과거 워든들의 영혼이 당신을 지켜봅니다.',
      choices: [
        { label: '덱 축복',        desc: '무작위 고급 카드 1장 추가',      effect: { type: 'add_cards', count: 1, rarity: 'uncommon' } },
        { label: '금고 축복',      desc: '+10 골드',                       effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'ravens_secret', title: '까마귀의 비밀', icon: '🪶',
      flavor: '까마귀가 당신의 적에 대해 속삭입니다.',
      choices: [
        { label: '귀 기울이기',    desc: '다음 웨이브 준비 시간 +5초',     effect: { type: 'extra_prep', seconds: 5 } },
        { label: '무시하기',       desc: '+4 골드',                        effect: { type: 'gold', amount: 4 } },
      ],
    },
    {
      id: 'storm_of_blades', title: '칼날의 폭풍', icon: '🌀',
      flavor: '마법 무기들의 소용돌이가 근처에 맴돌고 있습니다.',
      choices: [
        { label: '칼날 잡기',      desc: '무작위 희귀 카드 1장 추가',      effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '부품으로 팔기',  desc: '+14 골드',                       effect: { type: 'gold', amount: 14 } },
      ],
    },
    {
      id: 'dark_bargain', title: '어둠의 거래', icon: '🕯️',
      flavor: '그림자 같은 형체가 거래를 제안합니다. 위험을 감수할 가치가 있을까요?',
      choices: [
        { label: '거래하기',       desc: '무작위 카드 1장 제거 → +20 골드', effect: { type: 'remove_random_add_gold', amount: 20 } },
        { label: '거절하기',       desc: '+5 골드',                         effect: { type: 'gold', amount: 5 } },
      ],
    },
    // ── 신규 이벤트 10종 ──────────────────────────────────
    {
      id: 'wandering_healer', title: '떠돌이 치유사', icon: '💉',
      flavor: '현장 의무병이 부상자들, 그리고 넥서스까지 치료합니다.',
      choices: [
        { label: '넥서스 치료',   desc: '넥서스 HP 1 회복',     effect: { type: 'heal_nexus', amount: 1 } },
        { label: '보급품 받기',   desc: '+8 골드',               effect: { type: 'gold', amount: 8 } },
      ],
    },
    {
      id: 'lost_armory', title: '버려진 무기고', icon: '⚔️',
      flavor: '격전 이후 남겨진 미지 병사들의 무기들.',
      choices: [
        { label: '무장하기',     desc: '무작위 고급 카드 2장 추가',   effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '금속 팔기',    desc: '+15 골드',                    effect: { type: 'gold', amount: 15 } },
      ],
    },
    {
      id: 'arcane_surge', title: '비전 급등', icon: '✨',
      flavor: '격렬한 마력이 공기를 타고 운명을 뒤틀고 있습니다.',
      choices: [
        { label: '흡수하기',     desc: '무작위 희귀 카드 1장 추가',  effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '버텨내기',     desc: '+10 골드',                   effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'spectral_cache', title: '유령 금고', icon: '👻',
      flavor: '유령 같은 금고가 나타났다가 사라집니다.',
      choices: [
        { label: '약탈하기',    desc: '무작위 카드 1장 제거 → +25 골드', effect: { type: 'remove_random_add_gold', amount: 25 } },
        { label: '내버려두기',  desc: '+10 골드',                        effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'sentinel_rest', title: '보초병의 휴식', icon: '🏕️',
      flavor: '공격의 소강상태. 현명하게 활용하세요.',
      choices: [
        { label: '방어 강화',  desc: '다음 웨이브 준비 시간 +8초',  effect: { type: 'extra_prep', seconds: 8 } },
        { label: '휴식하기',  desc: '+7 골드',                      effect: { type: 'gold', amount: 7 } },
      ],
    },
    {
      id: 'warden_memory', title: '워든의 기억', icon: '🪬',
      flavor: '훈련의 깊은 곳에서 고대 기술이 떠오릅니다.',
      choices: [
        { label: '힘을 떠올리다',  desc: '희귀 카드 1장 추가',        effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '전술을 떠올리다', desc: '고급 카드 2장 추가',       effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
    },
    {
      id: 'void_shard', title: '공허 파편', icon: '🔮',
      flavor: '공허의 파편이 어두운 힘으로 맥동합니다.',
      choices: [
        { label: '흡수하기',      desc: '+18 골드, 넥서스 HP 1 감소', effect: { type: 'cursed_gold', amount: 18, nexusDmg: 1 } },
        { label: '버리기',        desc: '다음 웨이브 적 속도 -20%',   effect: { type: 'slow_next_wave', amount: 0.20 } },
      ],
    },
    {
      id: 'supply_drop', title: '보급 투하', icon: '📦',
      flavor: '후방 아군이 보급품을 보내왔습니다.',
      choices: [
        { label: '골드 받기',     desc: '+18 골드',                   effect: { type: 'gold', amount: 18 } },
        { label: '카드 받기',     desc: '무작위 일반 카드 3장 추가',  effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'ember_relic', title: '화염 유물', icon: '🔥',
      flavor: '만지면 따뜻합니다. 고대 전투의 축복이 깃들어 있습니다.',
      choices: [
        { label: '장착하기',     desc: '무작위 고급 카드 2장 추가',  effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '팔기',         desc: '+16 골드',                   effect: { type: 'gold', amount: 16 } },
      ],
    },
    {
      id: 'frozen_vault', title: '냉동 금고', icon: '❄️',
      flavor: '수 세기 동안 얼음 속에 봉인되어 있었습니다. 보물은 완벽하게 보존되었습니다.',
      choices: [
        { label: '해동하기',   desc: '덱에 희귀 카드 1장 추가',  effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '얼음 팔기',  desc: '+12 골드',                 effect: { type: 'gold', amount: 12 } },
      ],
    },
    // ── 신규 이벤트 10종 ──────────────────────────────────
    {
      id: 'elite_ambush', title: '정예 기습', icon: '🗡️',
      flavor: '정찰병이 정예 선발대가 예정보다 빨리 이동 중이라고 보고합니다.',
      choices: [
        { label: '함정 설치',       desc: '다음 웨이브 적 이동속도 -30%',     effect: { type: 'slow_next_wave', amount: 0.30 } },
        { label: '처치 보상 획득',  desc: '덱에 희귀 카드 1장 추가',          effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
    },
    {
      id: 'tower_blessing', title: '타워 축복', icon: '🌟',
      flavor: '비전 에너지가 방어 시설 전체를 관통합니다.',
      choices: [
        { label: '타워에 주입',     desc: '덱에 고급 카드 2장 추가',    effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '에너지 흡수',     desc: '+14 골드',                  effect: { type: 'gold', amount: 14 } },
      ],
    },
    {
      id: 'gold_fever', title: '황금열', icon: '💸',
      flavor: '전장의 땅 밑에 보물이 묻혀 있습니다.',
      choices: [
        { label: '깊이 채굴',   desc: '+22 골드',                 effect: { type: 'gold', amount: 22 } },
        { label: '빠르게 채굴', desc: '덱에 일반 카드 2장 추가',  effect: { type: 'add_cards', count: 2, rarity: 'common' } },
      ],
    },
    {
      id: 'debt_collector', title: '채권 추심인', icon: '💼',
      flavor: '절박한 상인이 단기 대출을 요청합니다 — 이자를 붙여 갚겠다고 합니다.',
      choices: [
        { label: '골드 빌려주기',  desc: '10g 지불 → 26g 획득 (순이익 +16g)', effect: { type: 'spend_for_gold', spend: 10, gain: 26 } },
        { label: '거절하기',       desc: '+4 골드 (수고비)',                   effect: { type: 'gold', amount: 4 } },
      ],
    },
    {
      id: 'relic_merchant', title: '유물 상인', icon: '🧿',
      flavor: '두건을 쓴 인물이 잊혀진 유물과 금지된 힘을 거래합니다.',
      choices: [
        { label: '희귀 지식 구매', desc: '덱에 희귀 카드 1장 추가',    effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '일반 물품 구매', desc: '덱에 일반 카드 3장 추가',    effect: { type: 'add_cards', count: 3, rarity: 'common' } },
      ],
    },
    {
      id: 'wardens_duel', title: '워든 결투', icon: '🏆',
      flavor: '라이벌 워든이 전장에서 당신의 명성에 도전합니다.',
      choices: [
        { label: '도전 수락',  desc: '덱에 희귀 카드 1장 추가',     effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
        { label: '협상',       desc: '덱에 고급 카드 2장 추가',     effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
      ],
    },
    {
      id: 'haunted_ground', title: '저주받은 땅', icon: '🪦',
      flavor: '전사자들의 영혼이 배회하며 경고를 속삭입니다.',
      choices: [
        { label: '영혼과 소통',  desc: '다음 웨이브 준비 시간 +10초', effect: { type: 'extra_prep', seconds: 10 } },
        { label: '영혼 퇴치',    desc: '덱에 희귀 카드 1장 추가',    effect: { type: 'add_cards', count: 1, rarity: 'rare' } },
      ],
    },
    {
      id: 'ancient_shrine', title: '고대 신전', icon: '⛩️',
      flavor: '잊혀진 전쟁신들을 위한 신전이 경로 위에 우뚝 서 있습니다.',
      choices: [
        { label: '지혜를 구하다', desc: '덱에 고급 카드 2장 추가', effect: { type: 'add_cards', count: 2, rarity: 'uncommon' } },
        { label: '신전 훼손',     desc: '+15 골드',               effect: { type: 'gold', amount: 15 } },
      ],
    },
    {
      id: 'war_horn', title: '전쟁 나팔', icon: '📯',
      flavor: '멀리서 나팔 소리가 들립니다 — 지원군이 행군 중입니다.',
      choices: [
        { label: '군대를 집결',  desc: '다음 웨이브 준비 시간 +8초', effect: { type: 'extra_prep', seconds: 8 } },
        { label: '나팔 판매',    desc: '+10 골드',                  effect: { type: 'gold', amount: 10 } },
      ],
    },
    {
      id: 'plague_doctor', title: '역병 의사', icon: '🧪',
      flavor: '가면을 쓴 의사가 넥서스를 위한 실험적 치료법을 제안합니다.',
      choices: [
        { label: '치료 수락',  desc: '8g 지불 → 넥서스 HP 1 회복', effect: { type: 'heal_nexus_cost', amount: 1, cost: 8 } },
        { label: '거절',       desc: '+5 골드',                    effect: { type: 'gold', amount: 5 } },
      ],
    },
  ],

  shop_rerolled_cost:     '{0}골드로 리롤했습니다',
  shop_upgrade_tower:     '타워 성급 업그레이드',
  shop_tower_upgrade_btn: '↑ {0}골드',
  shop_tower_max_star:    '최대 ★★★',
  tower_star_upgraded:    '{0} {1}★으로 성급 향상!',
  shop_next_reroll_cost:  '다음 리롤: {0}골드',
};

// DLC 번역 병합
export default { ..._BASE_KO, ...dlcShadowKo, ...dlcSolarKo };
