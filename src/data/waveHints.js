/**
 * 웨이브 실패 시 표시할 도움말 데이터
 * 각 항목: { en, ko, icon }
 * getWaveHints(waveNum) — 해당 웨이브에 맞는 힌트 최대 3개 반환
 */

const HINTS = {
  // ── Act 1 (Wave 1~5) ─────────────────────────────────
  1: [
    { icon: '🏹', en: 'Place towers early — even 2 Archers in the first wave make a big difference.', ko: '타워를 빠르게 배치하세요. 웨이브 1에서 궁수 2기만 있어도 크게 달라집니다.' },
    { icon: '💰', en: 'Use your starting gold on towers first, then upgrade later.', ko: '시작 골드는 타워 배치 우선! 업그레이드는 골드가 남을 때 하세요.' },
  ],
  2: [
    { icon: '⚡', en: 'Runners (fast enemies) move quickly — place towers near the end of the path.', ko: '러너(빠른 적)가 등장합니다. 경로 후반부에 타워를 배치하면 더 많이 잡을 수 있습니다.' },
    { icon: '🃏', en: 'Spell cards like Fireball deal instant damage to all enemies in range — great against fast waves.', ko: '파이어볼 같은 주문은 범위 내 모든 적에게 즉시 피해를 줍니다. 빠른 무리에 효과적입니다.' },
  ],
  3: [
    { icon: '🛡️', en: 'The first Tank appears here — it has high HP but moves slowly. Focus fire before it reaches the Nexus.', ko: '처음으로 탱크가 등장합니다. HP는 높지만 느리니 경로 초입에서 집중 공격하세요.' },
    { icon: '💣', en: 'Cannon towers deal AoE splash damage — great against clustered enemies.', ko: '대포 타워는 범위 피해를 줍니다. 적이 몰릴 때 특히 강력합니다.' },
  ],
  4: [
    { icon: '☠️', en: 'Cursed Wave! A random penalty activates — Speed (enemies faster), Hand (−2 cards), or Revive (enemies respawn once).', ko: '저주 웨이브! 무작위 패널티가 발동됩니다 — 속도 가속, 손패 −2, 또는 적 부활 중 하나입니다.' },
    { icon: '🃏', en: 'If the Cursed Hand penalty hits, play augment/summon cards before the wave starts to compensate.', ko: '손패 저주가 걸렸다면 웨이브 전에 강화·소환 카드를 미리 써두세요.' },
    { icon: '❄️', en: 'Speed-cursed waves move 35% faster — Freeze and Frost Mage slow are very effective here.', ko: '속도 저주 웨이브는 35% 빠르게 달립니다. 프리즈 주문이나 프로스트 메이지의 감속이 큰 도움이 됩니다.' },
  ],
  5: [
    { icon: '👑', en: 'Boss: 철갑 수호자 (Ironclad) — 520 HP. You need high sustained DPS, not just burst.', ko: '보스: 철갑 수호자 — HP 520. 한 방 피해보다 지속 DPS가 중요합니다.' },
    { icon: '⭐', en: 'Upgrade your best towers to ★2 (5g each) before the boss wave for a 1.4× damage boost.', ko: '보스 웨이브 전에 핵심 타워를 ★2로 업그레이드하세요 (5g). 피해가 1.4배 증가합니다.' },
    { icon: '⚡', en: 'Tesla Coil has the highest DPS among base towers — great for boss waves.', ko: 'Tesla Coil은 기본 타워 중 DPS가 가장 높습니다. 보스 웨이브에 특히 강력합니다.' },
  ],

  // ── Act 2 (Wave 6~10) ────────────────────────────────
  6: [
    { icon: '🛡️', en: 'Shielded enemies absorb 5 hits at half damage before the shield breaks. Spam attacks to pop shields fast.', ko: '방패 적은 5회 타격을 받아야 방패가 깨집니다. 공격 횟수가 많은 타워(Archer, Tesla)가 효과적입니다.' },
    { icon: '⚡', en: 'Tesla Coil\'s chain lightning hits multiple targets — great for clearing shields quickly.', ko: 'Tesla Coil의 체인 번개는 여러 적을 동시에 타격합니다. 방패 처리에 탁월합니다.' },
  ],
  7: [
    { icon: '🪨', en: 'Stone Golem is SLOW IMMUNE — Freeze and Frost Mage slows have no effect!', ko: 'Stone Golem은 슬로우 면역입니다! 프리즈와 프로스트 메이지 감속이 통하지 않습니다.' },
    { icon: '💣', en: 'Use Cannon or Fire Drake for raw damage against slow-immune enemies.', ko: '슬로우 면역 적엔 대포나 Fire Drake처럼 순수 피해 타워를 사용하세요.' },
  ],
  8: [
    { icon: '💀', en: 'Necromancer regenerates HP over time! Sustained DPS and DoT effects are key.', ko: 'Necromancer는 HP를 자동 회복합니다! 지속 피해(DoT) 효과가 핵심입니다.' },
    { icon: '🐉', en: 'Fire Drake\'s Burn DoT overrides HP regeneration — place it before the Necromancer arrives.', ko: 'Fire Drake의 화상 DoT는 HP 재생을 상쇄합니다. Necromancer 등장 전에 배치하세요.' },
  ],
  9: [
    { icon: '🧟', en: 'Plague Carrier has 35% damage reduction — raw damage is less effective. Use multi-hit towers instead.', ko: 'Plague Carrier는 35% 피해 감소. 단타 피해보다 다중 타격 타워(Tesla, Archer)가 효율적입니다.' },
    { icon: '🔥', en: 'Fire Drake\'s burn damage bypasses damage reduction over time.', ko: 'Fire Drake의 화상 피해는 시간이 지날수록 피해 감소를 극복합니다.' },
  ],
  10: [
    { icon: '👑', en: 'Boss: 공허의 거인 (Void Titan) — 1100 HP. Strongest boss so far.', ko: '보스: 공허의 거인 — HP 1100. 지금까지 중 가장 강한 보스입니다.' },
    { icon: '🌿', en: 'Druid Grove gives +15% damage aura to adjacent towers — position it in the center of your cluster.', ko: 'Druid Grove는 인접 타워에 +15% 피해 오라를 부여합니다. 타워 무리 중앙에 배치하세요.' },
    { icon: '⭐', en: 'Upgrade key towers to ★3 (12g) — the ×2.24 multiplier makes a huge difference against high-HP bosses.', ko: '핵심 타워를 ★3 (12g)로 업그레이드하세요 — ×2.24 배율이 고HP 보스에 크게 유효합니다.' },
  ],

  // ── Act 3 (Wave 11~15) ───────────────────────────────
  11: [
    { icon: '👻', en: 'Phantom enemies are CAMOUFLAGED — normal towers cannot see or target them!', ko: '팬텀은 위장(Camo) 적입니다 — 일반 타워가 감지하지 못합니다!' },
    { icon: '🔦', en: 'Place a Marksman tower (camoDetect) or find the Keen Eye relic to reveal camo enemies.', ko: 'Marksman 타워를 배치하거나 Keen Eye 유물을 획득하면 위장 적을 감지할 수 있습니다.' },
    { icon: '✨', en: 'Spells like Fireball, Freeze, and Chain Bolt hit ALL enemies regardless of camo!', ko: '파이어볼, 프리즈, 체인 볼트 등 광역 주문은 위장 여부와 관계없이 모든 적에게 적중합니다!' },
  ],
  12: [
    { icon: '🪨', en: 'Juggernaut is SLOW IMMUNE and very tanky — kite it with pure DPS towers.', ko: 'Juggernaut는 슬로우 면역 + 고체력 적입니다. 감속 없이 순수 DPS로 처리해야 합니다.' },
    { icon: '👻', en: 'Phantom camo enemies also appear from Wave 12 — make sure you have camo detection!', ko: 'Wave 12에도 위장 팬텀이 등장합니다. Marksman 또는 Keen Eye를 반드시 준비하세요!' },
  ],
  13: [
    { icon: '🏔️', en: 'Colossus is slow-immune and enrages below 40% HP — burst it down quickly once enraged.', ko: 'Colossus는 슬로우 면역이며 HP 40% 미만에서 격노합니다. 격노 후 빠르게 처치하세요.' },
    { icon: '💣', en: 'Siege Beast has 50% damage reduction — DoT effects (Fire Drake burn) are most efficient.', ko: 'Siege Beast는 50% 피해 감소를 지닙니다. Fire Drake 화상 DoT가 가장 효율적입니다.' },
  ],
  14: [
    { icon: '⚔️', en: 'Wave 14 is a full assault with ALL Act 3 enemy types at once — prepare diverse counters.', ko: 'Wave 14는 Act 3 모든 적이 동시에 등장하는 총공세입니다. 다양한 대응이 필요합니다.' },
    { icon: '🔦', en: 'Camo Phantoms, slow-immune Juggernauts, and damage-reduction enemies all appear together.', ko: '위장 팬텀, 슬로우 면역 Juggernaut, 피해 감소 적이 동시에 출현합니다.' },
    { icon: '🌿', en: 'Druid Grove aura + multiple ★2/★3 towers is the most reliable setup for this wave.', ko: 'Druid Grove 오라 + 다수 ★2/★3 타워 구성이 이 웨이브에서 가장 안정적입니다.' },
  ],
  15: [
    { icon: '🐉', en: 'Boss: 심연의 용 (Abyssal Dragon) — 3000+ HP. No single tower can solo this.', ko: '보스: 심연의 용 — HP 3000+. 타워 하나로는 절대 처치할 수 없습니다.' },
    { icon: '⭐', en: 'All key towers must be at ★3 before this wave — there is no shortcut.', ko: '이 웨이브 전 핵심 타워들을 반드시 ★3까지 업그레이드하세요.' },
    { icon: '🌿', en: 'Stack Druid Grove aura + Light Prism (if available) for maximum DPS on the boss.', ko: 'Druid Grove 오라 + Light Prism(있다면)을 스택해 보스에 최대 DPS를 집중하세요.' },
  ],

  // ── DLC Act 4 (Wave 16~23) ───────────────────────────
  16: [
    { icon: '🌑', en: 'Shadow Realm begins — Shadow Hounds are fast and fragile. Archer towers in clusters handle them well.', ko: '그림자 영역 시작 — Shadow Hound는 빠르지만 약합니다. 군집한 궁수 타워로 처리하세요.' },
    { icon: '🔷', en: 'Void Shade enemies teleport short distances — place towers to cover multiple path segments.', ko: 'Void Shade는 단거리 순간이동 능력이 있습니다. 경로 여러 구간을 커버하도록 배치하세요.' },
  ],
  17: [
    { icon: '💀', en: 'Void Reaper has HP regeneration — prioritize it with DoT damage.', ko: 'Void Reaper는 HP를 재생합니다. 화상 DoT로 우선 처치하세요.' },
  ],
  19: [
    { icon: '⚠️', en: 'Shadow Titan is a mid-boss with 1500+ HP — treat it like a boss wave. All towers fire on it.', ko: 'Shadow Titan은 HP 1500+ 중간 보스입니다. 보스 웨이브처럼 모든 타워를 집중시키세요.' },
  ],
  23: [
    { icon: '👑', en: 'Boss: 그림자 거신 (Shadow Colossus) — final DLC boss. Maximum firepower required.', ko: '보스: 그림자 거신 — DLC 최종 보스. 모든 화력을 동원하세요.' },
    { icon: '🌑', en: 'Shadow Beam (Shadow Warden passive) charges every 10 kills — save it for the boss.', ko: 'Shadow Warden의 Shadow Beam은 10킬마다 충전됩니다. 보스용으로 아껴두세요.' },
  ],

  // ── DLC 2 Act 5 (Wave 24~31) ────────────────────────
  24: [
    { icon: '☀️', en: 'Solar Realm begins — Solar Ember enemies swarm in large numbers. AoE towers are essential.', ko: '태양 영역 시작 — Solar Ember가 대규모로 출현합니다. 범위 공격 타워가 필수입니다.' },
  ],
  28: [
    { icon: '🌟', en: 'Solar Titan mid-boss — HP 2000+. Stack solar damage buffs from the Solar Warden passive.', ko: 'Solar Titan 중간 보스 — HP 2000+. Solar Warden의 Solar Beam 충전을 최대한 활용하세요.' },
  ],
  31: [
    { icon: '☀️', en: 'Boss: 태양신 (Sun God) — 3-phase final boss. Focus all DPS between phase transitions.', ko: '보스: 태양신 — 3단계 최종 보스. 페이즈 전환 사이에 모든 화력을 집중하세요.' },
    { icon: '🌟', en: 'Solar Warden\'s Solar Beam charges every 8 cost-2+ spells — cast spells throughout the wave.', ko: 'Solar Warden의 Solar Beam은 cost 2+ 주문 8회마다 발동합니다. 주문을 꾸준히 시전하세요.' },
  ],
};

/** 범위 매핑: HINTS에 없는 웨이브는 인접 범위로 fallback */
const RANGE_FALLBACKS = [
  { min: 1,  max: 3,  wave: 2 },
  { min: 4,  max: 5,  wave: 4 },
  { min: 6,  max: 8,  wave: 7 },
  { min: 9,  max: 10, wave: 9 },
  { min: 11, max: 13, wave: 11 },
  { min: 14, max: 15, wave: 14 },
  { min: 16, max: 18, wave: 16 },
  { min: 19, max: 22, wave: 19 },
  { min: 23, max: 23, wave: 23 },
  { min: 24, max: 27, wave: 24 },
  { min: 28, max: 30, wave: 28 },
  { min: 31, max: 99, wave: 31 },
];

/**
 * 실패한 웨이브 번호에 맞는 힌트 배열 반환 (최대 3개)
 * @param {number} waveNum
 * @returns {{ icon: string, en: string, ko: string }[]}
 */
export function getWaveHints(waveNum) {
  if (HINTS[waveNum]) return HINTS[waveNum].slice(0, 3);
  const range = RANGE_FALLBACKS.find(r => waveNum >= r.min && waveNum <= r.max);
  return range ? (HINTS[range.wave] ?? []).slice(0, 3) : [];
}
