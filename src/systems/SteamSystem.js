/**
 * Runewarden — Steam 통합 시스템 v0.3
 *
 * 구조:
 *   Renderer(SteamSystem) → preload(contextBridge) → main(steamworks.js)
 *
 * Steam 미실행 시 localStorage로 자동 폴백.
 */

// ── 업적 정의 (20개) ──────────────────────────────────
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
};

// ── Steam 통계 정의 ─────────────────────────────────
export const STEAM_STATS = {
  TOTAL_KILLS:    'stat_total_kills',
  TOTAL_WINS:     'stat_total_wins',
  TOTAL_RUNS:     'stat_total_runs',
  TOTAL_GOLD:     'stat_total_gold',
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
