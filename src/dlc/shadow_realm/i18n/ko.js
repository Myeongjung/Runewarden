/**
 * Shadow Realm DLC — 한국어 번역
 */

export default {
  // ── 워든 ─────────────────────────────────────────────
  dlc_sr_passive_name: '그림자 충전',
  dlc_sr_passive_desc: '적 처치마다 그림자 충전 +1. 10회 충전 시 강력한 그림자 주문이 무료로 자동 시전됩니다.',
  dlc_sr_warden_locked: 'Shadow Realm DLC 필요',

  // ── Shadow Charge HUD ───────────────────────────────
  dlc_sr_log_auto_cast:     (spell) => `👁️ 그림자 힘 해방! 자동 시전: ${spell}`,
  dlc_sr_log_shadow_charge: (n)     => `그림자 충전: ${n}/10`,

  // ── 유물 이름 ─────────────────────────────────────────
  relic_shadow_crystal:        '그림자 수정',
  relic_shadow_crystal_desc:   '암격 타워 피해 +50%.',
  relic_void_lens:             '공허 렌즈',
  relic_void_lens_desc:        '공허 파수꾼 타워 사거리 +60%.',
  relic_phantom_edge:          '환영의 날',
  relic_phantom_edge_desc:     '모든 타워 피해 +12%.',
  relic_death_shroud:          '죽음의 장막',
  relic_death_shroud_desc:     '적 처치마다 골드 +2.',
  relic_void_core:             '공허 코어',
  relic_void_core_desc:        '모든 타워 공격속도 20% 증가.',
  relic_shadow_hoard:          '그림자 비축',
  relic_shadow_hoard_desc:     '웨이브 클리어마다 골드 +5 획득.',
  relic_void_market:           '공허 시장',
  relic_void_market_desc:      '상점 카드 비용 2g 감소.',
  relic_souls_purse:           '영혼의 주머니',
  relic_souls_purse_desc:      '매 런 시작 시 보너스 골드 +15.',
  relic_shadow_ward:           '그림자 수호',
  relic_shadow_ward_desc:      '넥서스 HP +1로 시작.',
  relic_void_anchor:           '공허 닻',
  relic_void_anchor_desc:      '웨이브당 넥서스는 최대 1회만 피해를 받습니다.',
  relic_death_veil:            '죽음의 베일',
  relic_death_veil_desc:       '모든 감속 효과가 30% 강화됩니다.',
  relic_shadow_pact:           '그림자 협약',
  relic_shadow_pact_desc:      '그림자 타워 2개 이상 활성 시, 그림자 피해 +30%.',
  relic_void_echo_relic:       '공허 메아리',
  relic_void_echo_relic_desc:  '주문 시전 후 모든 Void 타워가 즉시 발사합니다. (8초 쿨다운)',
  log_void_echo_relic:         (n) => `공허 메아리! Void 타워 ${n}기 즉시 발사!`,
  relic_charge_crystal:        '충전 수정',
  relic_charge_crystal_desc:   '그림자 워든: 그림자 충전이 10 대신 8에서 발동됩니다.',
  relic_undying_will:          '불굴의 의지',
  relic_undying_will_desc:     '그림자 워든 전용: 적 5처치마다 그림자 충전 +1 보너스. 자동 시전까지 더 빠르게 도달합니다.',

  // ── 맵 이름 ──────────────────────────────────────────
  dlc_sr_map_void_corridor:    '공허 회랑',
  dlc_sr_map_phantom_crossing: '환영 교차로',
  dlc_sr_map_abyssal_spiral:   '심연의 나선',

  // ── 주문 로그 ─────────────────────────────────────────
  spell_darkness:         (pct, dmg, s) => `어둠! 모든 적 이동속도 -${pct}%, 모든 타워 피해 +${dmg}%, ${s}초 지속!`,
  spell_shadow_nova:      (total)       => `그림자 노바! 부상 적들에게 총 ${total} 피해!`,
  spell_void_pulse:       (n, steps)    => `공허 파동! 적 ${n}명을 ${steps}칸 밀어냈습니다.`,
  spell_soul_feast:       (n, g)        => n > 0 ? `영혼 향연! 적 ${n}마리 즉사 → +${g} 골드!` : '영혼 향연: 대상 적 없음.',
  spell_soul_surge:       (pct, s)      => `영혼 파동! 모든 타워 피해 +${pct}%, ${s}초 지속!`,
  spell_abyssal_wave:     (d, pct, s)   => `심연의 파도! ${d} 피해 + ${pct}% 감속 ${s}초!`,
  spell_shadow_step:      (n)           => `그림자 발걸음! 적 ${n}명을 스폰 지점으로 순간이동.`,
  spell_death_toll:       (n)           => `죽음의 값! 이번 웨이브 처치 보상 +${n} 골드.`,
  spell_entropy_cascade:  (total)       => `엔트로피 연쇄! 총 ${total} 피해 (현재 HP의 50%).`,
  spell_void_collapse:    (pct, s)      => `공허 붕괴! 모든 적 ${pct}% 감속 ${s}초.`,
  spell_void_grasp:       (s)           => `공허의 손길! 모든 적을 ${s}초 동안 빙결.`,
  spell_phantom_strike:   (n, d)        => `환영 강타! 적 ${n}명에게 ${d} 피해.`,
};
