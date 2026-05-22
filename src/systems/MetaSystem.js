// Warden 메타 진행 시스템 — localStorage 영구 저장
const SAVE_KEY = 'runewarden_meta_v1';

// ── 레벨 임계값 (레벨 n에 필요한 누적 XP) ─────────────
// threshold(n) = 80*n + 20*n²  → 부드러운 상승 곡선
export function xpForLevel(n) {
  return n <= 0 ? 0 : 80 * n + 20 * n * n;
}
export const MAX_RANK = 20;

// ── Warden Codex: 랭크별 언락 정의 ───────────────────
export const CODEX_UNLOCKS = [
  {
    rank: 1,
    title: 'Iron Warden',       titleKo: '철의 워든',
    icon: '🛡️',
    desc: 'You have survived your first battle. The path begins.',
    descKo: '첫 번째 전투에서 살아남았습니다. 여정이 시작됩니다.',
    type: 'badge',
  },
  {
    rank: 3,
    title: 'Frost Arts',        titleKo: '서리 술법',
    icon: '❄️',
    desc: 'Frost Mage & Haste cards now appear in the Shop.',
    descKo: '서리 마법사 & 신속 카드가 상점에 등장합니다.',
    type: 'cards',
    cards: ['summon_frost', 'aug_haste'],
  },
  {
    rank: 5,
    title: 'Blizzard Mastery',  titleKo: '눈보라 숙달',
    icon: '🌨️',
    desc: 'Blizzard spell now appears in the Shop.',
    descKo: '눈보라 주문이 상점에 등장합니다.',
    type: 'cards',
    cards: ['spell_freeze'],
  },
  {
    rank: 6,
    title: 'Elemental Arts',    titleKo: '정령 술법',
    icon: '🐉',
    desc: 'Fire Drake & Tesla Coil towers unlock in the Shop.',
    descKo: '화염 드레이크 & 테슬라 코일 타워가 상점에 해금됩니다.',
    type: 'cards',
    cards: ['summon_fire_drake', 'summon_tesla', 'aug_inferno', 'spell_blaze', 'spell_lightning'],
  },
  {
    rank: 7,
    title: 'Veteran\'s Purse',  titleKo: '노련한 주머니',
    icon: '💰',
    desc: 'Start each run with +5 bonus gold.',
    descKo: '매 런 시작 시 보너스 골드 +5.',
    type: 'bonus',
    bonus: { startGold: 5 },
  },
  {
    rank: 8,
    title: 'Advanced Arsenal',  titleKo: '고급 무기고',
    icon: '🏹',
    desc: 'Advanced towers, Catalyst, and powerful spells unlock in the Shop.',
    descKo: '고급 타워, 촉매, 강력한 주문들이 상점에 해금됩니다.',
    type: 'cards',
    cards: ['summon_glacial', 'summon_ballista', 'summon_frost_giant', 'summon_marksman',
            'aug_catalyst', 'aug_prime', 'spell_tower_rally', 'spell_soul_harvest',
            'spell_arcane_storm', 'spell_rally_cry', 'spell_crimson_tide',
            'spell_void_rift', 'spell_time_stop', 'spell_warden_call'],
  },
  {
    rank: 10,
    title: 'Seasoned Commander', titleKo: '역전의 사령관',
    icon: '⚔️',
    desc: 'Draw 1 extra card at the start of each wave (hand size 6).',
    descKo: '매 웨이브 시작 시 카드 1장 추가 드로우 (패 크기 6장).',
    type: 'bonus',
    bonus: { handSize: 1 },
  },
  {
    rank: 12,
    title: 'Arcane Repository',  titleKo: '비전 보관소',
    icon: '📚',
    desc: 'All Uncommon cards can now appear in the Shop.',
    descKo: '모든 언커먼 카드가 상점에 등장할 수 있습니다.',
    type: 'cards',
    cards: ['__all_uncommon__'],
  },
  {
    rank: 15,
    title: 'Rare Collector',     titleKo: '희귀 수집가',
    icon: '💎',
    desc: 'Rare cards now appear in the Shop.',
    descKo: '레어 카드가 상점에 등장합니다.',
    type: 'cards',
    cards: ['__all_rare__'],
  },
  {
    rank: 18,
    title: 'Nexus Guardian',     titleKo: '넥서스 수호자',
    icon: '🔮',
    desc: 'Start each run with 4 Nexus HP instead of 3.',
    descKo: '매 런 넥서스 HP가 3 대신 4로 시작합니다.',
    type: 'bonus',
    bonus: { nexusHp: 1 },
  },
  {
    rank: 20,
    title: 'Ascendant Warden',   titleKo: '초월의 워든',
    icon: '👑',
    desc: 'Ascension Mode unlocked. Face the ultimate challenge.',
    descKo: '어센션 모드 해금. 최고의 도전에 맞서세요.',
    type: 'badge',
  },
];

// ── XP 획득 계산 ──────────────────────────────────────
export function calcRunXP({ wavesCleared, enemiesKilled, nexusHpLeft, victory }) {
  const base      = wavesCleared * 15;
  const kills     = Math.floor(enemiesKilled * 1);
  const nexus     = nexusHpLeft * 8;
  const winBonus  = victory ? 50 : 0;
  return base + kills + nexus + winBonus;
}

// ── MetaSystem 클래스 ─────────────────────────────────
export class MetaSystem {
  constructor() {
    this._data = this._load();
  }

  // ── 저장/로드 ──────────────────────────────────────
  _load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return this._defaultData();
  }

  _save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this._data)); } catch {}
  }

  _defaultData() {
    return {
      totalXP:              0,
      rank:                 0,
      runsPlayed:           0,
      runsWon:              0,
      totalKills:           0,
      maxAscensionCleared:  0,   // 클리어한 최고 어센션 레벨 (0 = 미클리어)
      unlockedCards: [
        // Summon (common)
        'summon_archer', 'summon_cannon',
        // Augment (common)
        'aug_sharpen', 'aug_extend', 'aug_bulwark', 'aug_swift', 'aug_focus',
        'aug_rapid_fire', 'aug_battle_hymn', 'aug_guardian',
        // Spell (common)
        'spell_gold', 'spell_fireball', 'spell_earthquake',
        'spell_chain_bolt', 'spell_salvage', 'spell_volley',
        'spell_ice_storm', 'spell_void_bolt', 'spell_mass_slow', 'spell_needle',
      ],
      bonuses: { startGold: 0, handSize: 0, nexusHp: 0 },
      badges: [],
    };
  }

  // ── Getters ────────────────────────────────────────
  get rank()          { return this._data.rank; }
  get totalXP()       { return this._data.totalXP; }
  get runsPlayed()    { return this._data.runsPlayed; }
  get runsWon()       { return this._data.runsWon; }
  get totalKills()    { return this._data.totalKills; }
  get unlockedCards() { return this._data.unlockedCards; }
  get bonuses()       { return this._data.bonuses; }

  // 현재 레벨의 진행도 (0~1)
  get rankProgress() {
    const cur  = xpForLevel(this._data.rank);
    const next = xpForLevel(this._data.rank + 1);
    const xp   = this._data.totalXP;
    if (this._data.rank >= MAX_RANK) return 1;
    return Math.min(1, (xp - cur) / (next - cur));
  }

  get xpToNextRank() {
    if (this._data.rank >= MAX_RANK) return 0;
    return xpForLevel(this._data.rank + 1) - this._data.totalXP;
  }

  // ── Ascension ─────────────────────────────────────
  /** Rank 20 도달 시 도전 가능한 최고 어센션 레벨 (0 = 잠김) */
  get maxSelectableAscension() {
    if (this._data.rank < MAX_RANK) return 0;
    return Math.min(3, (this._data.maxAscensionCleared ?? 0) + 1);
  }

  get maxAscensionCleared() {
    return this._data.maxAscensionCleared ?? 0;
  }

  /**
   * 어센션 클리어 기록. 새 기록이면 true 반환.
   */
  clearAscension(level) {
    const current = this._data.maxAscensionCleared ?? 0;
    if (level > current) {
      this._data.maxAscensionCleared = level;
      this._save();
      return true;
    }
    return false;
  }

  // ── 런 종료 처리 → XP 적용, 레벨업, 언락 반환 ────
  applyRunResult({ wavesCleared, enemiesKilled, nexusHpLeft, victory }, xpMultiplier = 1) {
    const xpGained = Math.round(calcRunXP({ wavesCleared, enemiesKilled, nexusHpLeft, victory }) * xpMultiplier);

    this._data.totalXP   += xpGained;
    this._data.runsPlayed++;
    if (victory) this._data.runsWon++;
    this._data.totalKills += enemiesKilled;

    // 레벨업 처리
    const newUnlocks = [];
    while (
      this._data.rank < MAX_RANK &&
      this._data.totalXP >= xpForLevel(this._data.rank + 1)
    ) {
      this._data.rank++;
      const unlock = CODEX_UNLOCKS.find(u => u.rank === this._data.rank);
      if (unlock) {
        newUnlocks.push(unlock);
        this._applyUnlock(unlock);
      }
    }

    this._save();
    return { xpGained, newUnlocks };
  }

  _applyUnlock(unlock) {
    if (unlock.type === 'cards' && unlock.cards) {
      for (const id of unlock.cards) {
        if (!this._data.unlockedCards.includes(id)) {
          this._data.unlockedCards.push(id);
        }
      }
    }
    if (unlock.type === 'bonus' && unlock.bonus) {
      for (const [k, v] of Object.entries(unlock.bonus)) {
        this._data.bonuses[k] = (this._data.bonuses[k] || 0) + v;
      }
    }
    if (unlock.type === 'badge') {
      this._data.badges.push(unlock.title);
    }
  }

  // ── 개발용: 리셋 ──────────────────────────────────
  reset() {
    this._data = this._defaultData();
    this._save();
  }
}
