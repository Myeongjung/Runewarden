/**
 * Solar Dominion DLC — Korean translations
 * Prefix: dlc_sd_
 */

export default {
  // ── Warden ─────────────────────────────────────────
  dlc_sd_passive_name: '태양 충전',
  dlc_sd_passive_desc: 'cost 2 이상 주문을 시전할 때마다 태양 충전 +1. 8회 충전 시 Solar Beam 자동 시전.',
  dlc_sd_warden_locked: 'Solar Dominion DLC 필요',

  // ── Solar Charge HUD ────────────────────────────────
  dlc_sd_log_auto_cast:     (spell) => `☀️ 태양의 힘이 해방됐습니다! 자동 시전: ${spell}`,
  dlc_sd_log_solar_charge:  (n, max) => `태양 충전: ${n}/${max}`,

  // ── Relic names ─────────────────────────────────────
  relic_solar_lens:           '태양 렌즈',
  relic_solar_lens_desc:      '신성 대포 타워 공격 사거리 +60%.',
  relic_titan_bane:           '타이탄 살해자',
  relic_titan_bane_desc:      'Solar DoT 초당 피해 +4, 지속 시간 1.5초 연장.',
  relic_radiant_core:         '빛의 코어',
  relic_radiant_core_desc:    '모든 타워 피해 +12%.',
  relic_solar_capacitor:      '태양 축전기',
  relic_solar_capacitor_desc: '모든 타워 공격 속도 20% 증가.',
  relic_crusader_relic:       '성전사의 열의',
  relic_crusader_relic_desc:  '성전사 스턴 지속 시간 +200ms.',
  relic_solar_tribute:        '태양 공납',
  relic_solar_tribute_desc:   '웨이브 클리어마다 골드 +6.',
  relic_sun_market:           '태양 시장',
  relic_sun_market_desc:      '상점 카드 비용 2g 감소.',
  relic_golden_chalice:       '황금 성배',
  relic_golden_chalice_desc:  '런 시작 시 골드 +18.',
  relic_solar_ward:           '태양 수호막',
  relic_solar_ward_desc:      '넥서스 HP +1로 시작.',
  relic_holy_bastion:         '신성한 보루',
  relic_holy_bastion_desc:    '웨이브당 넥서스 최대 1회 피격.',
  relic_blinding_amulet:      '눈부신 부적',
  relic_blinding_amulet_desc: '모든 감속 효과 25% 강화.',
  relic_solar_pact_relic:     '태양 협정',
  relic_solar_pact_relic_desc:'Solar 타워 2개+ 시, 모든 Solar 피해 +30%.',
  relic_light_prism_bonus:    '프리즘 증폭기',
  relic_light_prism_bonus_desc:'빛의 프리즘 오라가 인접 타워에 추가 +10% 피해 보너스 부여.',
  relic_solar_crown:          '태양의 왕관',
  relic_solar_crown_desc:     'Solar Warden 전용: 태양 충전이 8 대신 6에서 발동.',
  relic_radiant_will:         '빛나는 의지',
  relic_radiant_will_desc:    'Solar Warden 전용: cost 4+ 주문 시전 시 태양 충전 +1 추가.',

  // ── Map names ──────────────────────────────────────
  dlc_sd_map_solar_forum:       '태양 원형경기장',
  dlc_sd_map_sunken_temple:     '가라앉은 사원',
  dlc_sd_map_blazing_corridor:  '불꽃 회랑',

  // ── Spell logs ─────────────────────────────────────
  spell_solar_beam:       (d, pct, s) => `Solar Beam! 모든 적에게 ${d} 피해 + ${pct}% 감속 ${s}초!`,
  spell_divine_shield:    (s)        => `신성 방패! 넥서스 ${s}초 무적!`,
  spell_solar_flare:      (dps, s)   => `Solar Flare! 모든 적에게 초당 ${dps} Solar DoT ${s}초!`,
  spell_solar_tithe:      (g)        => `태양 십일조! ${g}골드 소비 — 모든 적 ×2 피해!`,
  spell_radiant_burst:    (d)        => `빛의 폭발! 모든 적에게 ${d} 피해!`,
  spell_sunburst:         (d, pct, s)=> `태양 섬광! 선두 ${d} 피해 + ${pct}% 감속 ${s}초!`,
  spell_gold_tithe:       (g)        => `황금 십일조! +${g} 골드 획득!`,
  spell_solar_nova:       (d)        => `태양 노바! 모든 적 ${d} 피해 (Solar DoT 대상 2배)!`,
  spell_heavenly_light:   (hp, g)    => `천상의 빛! 넥서스 +${hp} HP, +${g} 골드!`,
  spell_blinding_light:   (s)        => `눈부신 빛! 모든 적 ${s}초 빙결!`,
  spell_solar_surge:      (pct, s)   => `태양 급등! 모든 타워 +${pct}% 공속 ${s}초!`,
  spell_divine_wrath:     (d)        => `신성한 진노! 선두 적에게 ${d} 피해!`,
  spell_solar_corona:     (dps, s)   => `태양 코로나! Solar DoT ${dps}dps ${s}초 + 태양 충전 보너스!`,

  // ── Event logs ─────────────────────────────────────
  event_invest_gold_return: (g) => `황금 투자 회수! +${g} 골드!`,
};
