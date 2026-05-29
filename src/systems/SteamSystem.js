/**
 * Runewarden — Steam 통합 시스템 v0.3
 *
 * 구조:
 *   Renderer(SteamSystem) → preload(contextBridge) → main(steamworks.js)
 *
 * Steam 미실행 시 localStorage로 자동 폴백.
 */

// ── 업적 정의 (40개) ──────────────────────────────────
export const ACHIEVEMENTS = {
  // ── 첫 경험 ───────────────────────────────────────
  FIRST_RUN:       { id: 'FIRST_RUN',       name: 'The First Siege',      desc: 'Complete your first run.',                         icon: '🛡️' },
  FIRST_WIN:       { id: 'FIRST_WIN',       name: 'Warden Victorious',    desc: 'Win your first run.',                              icon: '🏆' },
  FIRST_WAVE:      { id: 'FIRST_WAVE',      name: 'Line Held',            desc: 'Clear Wave 1 without nexus damage.',               icon: '⚔️' },

  // ── 전투 ──────────────────────────────────────────
  KILL_100:        { id: 'KILL_100',        name: 'Slaughterer',          desc: 'Slay 100 enemies total.',                          icon: '💀' },
  KILL_1000:       { id: 'KILL_1000',       name: 'Warden of Blood',      desc: 'Slay 1,000 enemies total.',                        icon: '☠️' },
  TANK_KILLER:     { id: 'TANK_KILLER',     name: 'Giant Slayer',         desc: 'Destroy a Tank enemy.',                            icon: '💣' },
  BOSS_KILLER:     { id: 'BOSS_KILLER',     name: 'Ironclad Breaker',     desc: 'Defeat the Ironclad boss.',                        icon: '💥' },
  PERFECT_WAVE:    { id: 'PERFECT_WAVE',    name: 'Untouchable',          desc: 'Clear a wave with no enemies reaching the exit.',  icon: '✨' },
  ELITE_HUNTER:    { id: 'ELITE_HUNTER',    name: 'Elite Slayer',         desc: 'Kill 10 Elite enemies in a single run.',           icon: '🔱' },

  // ── 덱빌딩 ────────────────────────────────────────
  BIG_DECK:        { id: 'BIG_DECK',        name: 'Card Collector',       desc: 'Have 20+ cards in your deck during a run.',        icon: '🃏' },
  TRIPLE_AUGMENT:  { id: 'TRIPLE_AUGMENT',  name: 'Master Enhancer',      desc: 'Augment 3 different towers in one run.',           icon: '⚡' },
  SPELL_POWER:     { id: 'SPELL_POWER',     name: 'Arcane Volley',        desc: 'Cast 5 spells in a single wave.',                  icon: '🔮' },
  ALL_TOWERS:      { id: 'ALL_TOWERS',      name: 'Master Builder',       desc: 'Place all 6 tower types in a single run.',         icon: '🏰' },

  // ── 메타 진행 ─────────────────────────────────────
  RANK_5:          { id: 'RANK_5',          name: 'Veteran Warden',       desc: 'Reach Warden Rank 5.',                             icon: '⭐' },
  RANK_10:         { id: 'RANK_10',         name: 'Seasoned Commander',   desc: 'Reach Warden Rank 10.',                            icon: '🌟' },
  RANK_20:         { id: 'RANK_20',         name: 'Ascendant',            desc: 'Reach the maximum Warden Rank.',                   icon: '👑' },

  // ── 숨겨진 ────────────────────────────────────────
  CURSED_WIN:      { id: 'CURSED_WIN',      name: 'Cursed Victory',       desc: 'Win a run after accepting the Cursed Relic.',      icon: '🕯️' },
  PERFECT_RUN:     { id: 'PERFECT_RUN',     name: 'Flawless Warden',      desc: 'Win with all 3 Nexus HP remaining.',               icon: '💎' },
  SPEED_RUN:       { id: 'SPEED_RUN',       name: 'Swift Justice',        desc: 'Win a run in under 20 minutes.',                   icon: '⚡' },
  NEXUS_HEAL:      { id: 'NEXUS_HEAL',      name: 'Blessed Warden',       desc: 'Restore Nexus HP during a run.',                   icon: '💚' },

  // ── 워든별 승리 ───────────────────────────────────
  IRON_WIN:        { id: 'IRON_WIN',        name: 'Iron Resolve',         desc: 'Win a run as the Iron Warden.',                    icon: '🔩' },
  STORM_WIN:       { id: 'STORM_WIN',       name: 'Storm Caller',         desc: 'Win a run as the Storm Warden.',                   icon: '⛈️' },
  ARCANE_WIN:      { id: 'ARCANE_WIN',      name: 'Arcane Triumph',       desc: 'Win a run as the Arcane Warden.',                  icon: '🔯' },
  SHADOW_WIN:      { id: 'SHADOW_WIN',      name: 'Shadow Sovereign',     desc: 'Win a run as the Shadow Warden.',                  icon: '🌑' },

  // ── 챌린지 클리어 ─────────────────────────────────
  ACH_ARCHER_ONLY:     { id: 'ACH_ARCHER_ONLY',     name: 'Arrow Rain',           desc: 'Win a run with the Archer Only challenge active.',         icon: '🏹' },
  ACH_POVERTY_WIN:     { id: 'ACH_POVERTY_WIN',     name: 'Rags to Riches',       desc: 'Win a run with the Poverty challenge active.',             icon: '💸' },
  ACH_PERFECT_DEFENSE: { id: 'ACH_PERFECT_DEFENSE', name: 'Perfect Defense',      desc: 'Win a run with the Perfect Defense challenge active.',     icon: '🛡️' },
  ACH_NO_SPELLS_WIN:   { id: 'ACH_NO_SPELLS_WIN',   name: 'Silent Warden',        desc: 'Win a run with the Silence challenge active.',             icon: '🔇' },
  ACH_IMMUTABLE_WIN:   { id: 'ACH_IMMUTABLE_WIN',   name: 'Immutable Force',      desc: 'Win a run with the Immutable challenge active.',           icon: '⛔' },
  ACH_TRIPLE_CURSE:    { id: 'ACH_TRIPLE_CURSE',    name: 'Triple Threat',        desc: 'Win a run with 3 or more challenges active simultaneously.', icon: '⚠️' },

  // ── 덱 시너지 ─────────────────────────────────────
  ACH_FROST_MASTER:    { id: 'ACH_FROST_MASTER',    name: 'Frost Overlord',       desc: 'Win a run with both Frost and Glacial towers placed.',     icon: '❄️' },
  ACH_FIRE_SWARM:      { id: 'ACH_FIRE_SWARM',      name: 'Inferno Swarm',        desc: 'Win a run with 3 or more Fire Drake towers placed.',       icon: '🔥' },
  ACH_TESLA_CHAIN:     { id: 'ACH_TESLA_CHAIN',     name: 'Chain Lightning',      desc: 'Win a run with Tesla placed and 10+ spells cast.',         icon: '⚡' },
  ACH_DRUID_CORE:      { id: 'ACH_DRUID_CORE',      name: 'Nature\'s Guardian',   desc: 'Win a run with a Druid tower placed.',                     icon: '🌿' },
  ACH_SPELL_SLINGER:   { id: 'ACH_SPELL_SLINGER',   name: 'Spell Slinger',        desc: 'Cast 15 or more spells in a single run.',                  icon: '🔮' },

  // ── 전투 마일스톤 ─────────────────────────────────
  WAVE_10_CLEAR:   { id: 'WAVE_10_CLEAR',   name: 'Midpoint Defender',    desc: 'Clear Wave 10.',                                   icon: '🌊' },
  WAVE_15_CLEAR:   { id: 'WAVE_15_CLEAR',   name: 'Final Stand',          desc: 'Clear Wave 15.',                                   icon: '🌊' },
  KILL_5000:       { id: 'KILL_5000',       name: 'Warden of Annihilation', desc: 'Slay 5,000 enemies total.',                      icon: '💀' },
  NEXUS_CRISIS:    { id: 'NEXUS_CRISIS',    name: 'Last Breath',          desc: 'Win a run with only 1 Nexus HP remaining.',        icon: '❤️' },
  VETERAN_WIN:     { id: 'VETERAN_WIN',     name: 'Veteran\'s Triumph',   desc: 'Win a run on Veteran difficulty.',                 icon: '🎖️' },
};

// ── Steam 통계 정의 ─────────────────────────────────
export const STEAM_STATS = {
  TOTAL_KILLS:    'stat_total_kills',
  TOTAL_WINS:     'stat_total_wins',
  TOTAL_RUNS:     'stat_total_runs',
  TOTAL_GOLD:     'stat_total_gold',
};

// ── DLC 정의 ────────────────────────────────────────
// Steam Partner에서 DLC App ID 발급 후 여기에 입력
export const DLC_DEFS = {
  shadow_realm: {
    id:       'shadow_realm',
    name:     'Shadow Realm',
    nameKo:   '그림자 왕국',
    steamAppId: 0,   // TODO: Steam DLC App ID 입력
    price:    '$4.99',
  },
};

// ── SteamSystem 클래스 ───────────────────────────────
export class SteamSystem {
  constructor() {
    // preload 브릿지 — Steam 없을 경우 null
    this._api   = window.steamAPI ?? null;
    this._ready = false;   // 비동기로 확인
    this._localUnlocked = new Set(
      JSON.parse(localStorage.getItem('rw_achievements') ?? '[]')
    );

    // 비동기 가용성 확인
    this._init();
  }

  async _init() {
    try {
      if (this._api?.isAvailable) {
        this._ready = await this._api.isAvailable();
      }
      if (this._ready) {
        const name = await this._api.getPlayerName?.() ?? 'Warden';
        console.log(`[Steam] ✅ Connected — ${name}`);
      } else {
        console.log('[Steam] Offline mode — localStorage fallback');
      }
    } catch (e) {
      console.warn('[Steam] Init error:', e.message);
      this._ready = false;
    }
  }

  // ── 업적 언락 ─────────────────────────────────────
  async unlockAchievement(id) {
    if (this._localUnlocked.has(id)) return;

    this._localUnlocked.add(id);
    this._saveLocal();

    const ach = ACHIEVEMENTS[id];
    if (!ach) { console.warn('[Steam] Unknown achievement:', id); return; }

    // Steam API
    if (this._ready && this._api) {
      try {
        await this._api.unlockAchievement(id);
        console.log(`[Steam] 🏆 ${ach.name}`);
      } catch (e) {
        console.warn('[Steam] Achievement error:', e.message);
      }
    }

    this._showToast(ach);
  }

  isUnlocked(id) { return this._localUnlocked.has(id); }

  // ── DLC 소유 여부 확인 ────────────────────────────
  /**
   * DLC 구매 여부를 확인합니다.
   * @param {string} dlcKey — DLC_DEFS의 키 (예: 'shadow_realm')
   * @returns {boolean}
   *
   * 우선순위:
   * 1. 개발 모드 → 항상 true (테스트 편의)
   * 2. Steam API → isSubscribedApp(appId)
   * 3. localStorage 오버라이드 → 크리에이터 키/테스트용
   * 4. 기본값 → false
   */
  isDlcOwned(dlcKey) {
    const dlc = DLC_DEFS[dlcKey];
    if (!dlc) return false;

    // 개발 모드 우회 (콘솔: localStorage.setItem('rw_dev','1') 후 새로고침)
    if (localStorage.getItem('rw_dev') === '1') return true;

    // localStorage 오버라이드 (크리에이터 키·베타 배포용)
    const overrides = JSON.parse(localStorage.getItem('rw_dlc_owned') ?? '[]');
    if (overrides.includes(dlcKey)) return true;

    // Steam API: BIsDlcInstalled — 소유 + 설치 여부 동시 확인
    // (BIsSubscribedApp는 소유만 확인, DLC에는 BIsDlcInstalled가 정확함)
    if (this._ready && this._api && dlc.steamAppId > 0) {
      try {
        // steamworks.js는 apps.isDlcInstalled(appId) 형태로 노출
        return this._api.isDlcInstalled?.(dlc.steamAppId)
            ?? this._api.isSubscribedApp?.(dlc.steamAppId)  // 폴백
            ?? false;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * 현재 앱에 등록된 DLC 목록 조회 (Steam 기준)
   * GetDLCCount + BGetDLCDataByIndex 활용
   * @returns {{ appId: number, name: string, available: boolean }[]}
   */
  getRegisteredDlcs() {
    if (!this._ready || !this._api) return [];
    try {
      const count = this._api.getDLCCount?.() ?? 0;
      const result = [];
      for (let i = 0; i < count; i++) {
        const data = this._api.getDLCDataByIndex?.(i);
        if (data) result.push(data);
      }
      return result;
    } catch {
      return [];
    }
  }

  /**
   * DLC 활성화 (크리에이터 키, 베타 테스트용)
   * @param {string} dlcKey
   */
  activateDlcLocally(dlcKey) {
    const owned = JSON.parse(localStorage.getItem('rw_dlc_owned') ?? '[]');
    if (!owned.includes(dlcKey)) {
      owned.push(dlcKey);
      localStorage.setItem('rw_dlc_owned', JSON.stringify(owned));
    }
  }

  // ── 통계 갱신 ─────────────────────────────────────
  async setStat(statKey, value) {
    if (!this._ready || !this._api) return;
    try {
      await this._api.setStat(statKey, value);
    } catch (e) {
      console.warn('[Steam] SetStat error:', e.message);
    }
  }

  // ── 런 종료 시 업적 일괄 체크 ────────────────────
  checkRunStats({ wavesCleared, enemiesKilled, nexusHpLeft, victory,
                  runTimeMs, cardsPlayed, towersPlaced, spellsCastThisWave,
                  augmentsApplied, eliteKills, bossKilled, nexusHealed }) {

    if (wavesCleared >= 1) this.unlockAchievement('FIRST_RUN');

    if (victory) {
      this.unlockAchievement('FIRST_WIN');
      if (nexusHpLeft >= 3)           this.unlockAchievement('PERFECT_RUN');
      if (runTimeMs < 20 * 60 * 1000) this.unlockAchievement('SPEED_RUN');
    }

    if (bossKilled)   this.unlockAchievement('BOSS_KILLER');
    if (nexusHealed)  this.unlockAchievement('NEXUS_HEAL');

    if ((augmentsApplied ?? 0) >= 3)    this.unlockAchievement('TRIPLE_AUGMENT');
    if ((spellsCastThisWave ?? 0) >= 5) this.unlockAchievement('SPELL_POWER');
    if ((eliteKills ?? 0) >= 10)        this.unlockAchievement('ELITE_HUNTER');

    // 6종 타워 전부 소환했는지는 GameEngine에서 별도 체크
  }

  checkKillMilestone(totalKills) {
    if (totalKills >=   100) this.unlockAchievement('KILL_100');
    if (totalKills >= 1_000) this.unlockAchievement('KILL_1000');
    if (totalKills >= 5_000) this.unlockAchievement('KILL_5000');
  }

  checkRankMilestone(rank) {
    if (rank >=  5) this.unlockAchievement('RANK_5');
    if (rank >= 10) this.unlockAchievement('RANK_10');
    if (rank >= 20) this.unlockAchievement('RANK_20');
  }

  checkDeckSize(deckSize) {
    if (deckSize >= 20) this.unlockAchievement('BIG_DECK');
  }

  checkAllTowers(towerTypesUsed) {
    if (towerTypesUsed.size >= 6) this.unlockAchievement('ALL_TOWERS');
  }

  // ── 토스트 알림 ───────────────────────────────────
  _showToast(ach) {
    const existing = document.querySelector('.achievement-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <span class="ach-icon">${ach.icon}</span>
      <div class="ach-text">
        <div class="ach-label">Achievement Unlocked</div>
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
      </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  _saveLocal() {
    localStorage.setItem('rw_achievements', JSON.stringify([...this._localUnlocked]));
  }
}
