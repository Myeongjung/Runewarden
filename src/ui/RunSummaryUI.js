// 런 종료 요약 화면 — XP 바 애니메이션 + 언락 표시
import { xpForLevel, MAX_RANK } from '../systems/MetaSystem.js';
import { i18n } from '../i18n/i18n.js';
import { getWaveHints } from '../data/waveHints.js';

export class RunSummaryUI {
  constructor(container) {
    this.container = container;
    this._onContinue = null;
  }

  // stats: { victory, wavesCleared, enemiesKilled, goldEarned, cardsPlayed, nexusHpLeft }
  // meta:  { rankBefore, rankAfter, xpBefore, xpAfter, xpGained, newUnlocks }
  show(stats, meta, callbacks) {
    this._onContinue = callbacks.onContinue;
    this._onMenu     = callbacks.onMenu;
    this._onRetry    = callbacks.onRetry;

    this.container.classList.remove('hidden');
    this.container.innerHTML = this._buildHTML(stats, meta);

    this._bindButtons();

    // XP 바 애니메이션 (딜레이 후 실행)
    setTimeout(() => this._animateXP(meta), 400);

    // 언락 카드 순차 표시
    if (meta.newUnlocks?.length > 0) {
      this._animateUnlocks(meta.newUnlocks);
    }

    // 입장 애니메이션
    const box = this.container.querySelector('.summary-box');
    box.style.animation = 'shopSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)';
  }

  _buildHTML(stats, meta) {
    const isVictory = stats.victory;
    const xpBarWidthBefore = this._xpPercent(meta.rankBefore, meta.xpBefore);

    return `
      <div class="summary-box">
        <!-- 헤더 -->
        <div class="summary-header ${isVictory ? 'victory' : 'defeat'}">
          <div class="summary-result-icon">${isVictory ? '🏆' : '💀'}</div>
          <div class="summary-result-text">${isVictory ? i18n.t('summary_victory') : i18n.t('summary_defeat')}</div>
          <div class="summary-result-sub">${isVictory ? i18n.t('summary_victory_sub') : i18n.t('summary_defeat_sub', stats.wavesCleared)}</div>
        </div>

        <!-- 런 정보 (맵·난이도) -->
        ${stats.mapName || stats.difficultyName ? `
        <div class="summary-run-info">
          <span class="run-info-item">${stats.mapIcon ?? '🗺️'} ${stats.mapName ?? i18n.t('summary_map')}</span>
          <span class="run-info-sep">•</span>
          <span class="run-info-item">${stats.difficultyIcon ?? '⚔️'} ${stats.difficultyName ?? ''}</span>
          ${stats.ascension > 0 ? `<span class="run-info-sep">•</span><span class="run-info-item asc-badge">⚡ Asc ${stats.ascension}</span>` : ''}
        </div>` : ''}

        <!-- 런 통계 -->
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-icon">🌊</span>
            <span class="stat-label">${i18n.t('stat_waves_cleared')}</span>
            <span class="stat-value">${stats.wavesCleared}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💀</span>
            <span class="stat-label">${i18n.t('stat_enemies_slain')}</span>
            <span class="stat-value">${stats.enemiesKilled}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <span class="stat-label">${i18n.t('stat_gold_earned')}</span>
            <span class="stat-value">${stats.goldEarned}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🃏</span>
            <span class="stat-label">${i18n.t('stat_cards_played')}</span>
            <span class="stat-value">${stats.cardsPlayed}</span>
          </div>
        </div>

        <!-- XP & 랭크 -->
        <div class="summary-xp-section">
          <div class="summary-rank-row">
            <div class="rank-badge">
              <span class="rank-icon">⚜️</span>
              <span class="rank-label">${i18n.t('rank_label')}</span>
              <span class="rank-num" id="rank-display">${meta.rankBefore}</span>
            </div>
            <div class="xp-gained-badge">
              ${i18n.t('xp_gained', meta.xpGained)}
            </div>
          </div>

          <!-- XP 바 -->
          <div class="xp-bar-track">
            <div class="xp-bar-fill" id="xp-bar" style="width: ${xpBarWidthBefore}%"></div>
            <div class="xp-bar-new" id="xp-bar-new" style="width: 0%"></div>
          </div>
          <div class="xp-bar-labels">
            <span id="xp-label-cur">${i18n.t('rank_num', meta.rankBefore)}</span>
            <span id="xp-label-next">${meta.rankAfter < MAX_RANK ? i18n.t('rank_num', meta.rankAfter + 1) : i18n.t('max_rank')}</span>
          </div>
        </div>

        <!-- 새 언락 -->
        <div id="summary-unlocks" class="summary-unlocks"></div>

        <!-- 전체 통계 (누적) -->
        <div class="summary-lifetime">
          <span>${i18n.t('lifetime_runs', meta.totalRuns)}</span>
          <span>•</span>
          <span>${i18n.t('lifetime_wins', meta.totalWins)}</span>
          <span>•</span>
          <span>${i18n.t('lifetime_kills', meta.totalKills)}</span>
        </div>

        <!-- 최근 런 히스토리 -->
        ${this._buildRunHistory(meta.runHistory)}

        <!-- 패배 도움말 -->
        ${!isVictory ? this._buildHints(stats.wavesCleared) : ''}

        <!-- 버튼 -->
        <div class="summary-buttons">
          <div class="summary-btn-group">
            <button class="btn-primary" id="sum-continue">▶ ${i18n.t('btn_play_again')}</button>
            <div class="summary-btn-hint">${i18n.lang === 'ko' ? '새 워든 &amp; 난이도 선택' : 'New warden &amp; difficulty'}</div>
          </div>
          ${this._onRetry ? `<div class="summary-btn-group"><button class="btn-secondary btn-retry-same" id="sum-retry">⚡ ${i18n.lang === 'ko' ? '동일 조건 재시작' : 'Quick Restart'}</button><div class="summary-btn-hint">${i18n.lang === 'ko' ? '같은 워든 &amp; 난이도' : 'Same warden &amp; difficulty'}</div></div>` : ''}
          <button class="btn-secondary" id="sum-menu">${i18n.t('btn_main_menu')}</button>
        </div>
      </div>
    `;
  }

  _buildHints(waveNum) {
    const hints = getWaveHints(waveNum).slice(0, 2);
    if (!hints.length) return '';
    const isKo = i18n.lang === 'ko';
    const title = isKo ? `💡 웨이브 ${waveNum} 공략 도움말` : `💡 Wave ${waveNum} Tips`;
    const items = hints.map(h => `
      <div class="hint-item">
        <span class="hint-icon">${h.icon}</span>
        <span class="hint-text">${isKo ? h.ko : h.en}</span>
      </div>`).join('');
    return `<div class="summary-hints"><div class="summary-hints-title">${title}</div>${items}</div>`;
  }

  _buildRunHistory(history) {
    if (!history?.length) return '';
    const isKo = i18n.lang === 'ko';
    const items = history.map(r => {
      const result = r.victory ? '✅' : '❌';
      const waves  = `W${r.wavesCleared}`;
      const asc    = r.ascension > 0 ? ` ⚡${r.ascension}` : '';
      return `<div class="run-history-item">
        <span class="rhi-result">${result}</span>
        <span>${r.wardenIcon ?? '🛡️'} ${isKo ? (r.wardenNameKo ?? r.wardenName ?? r.wardenId) : (r.wardenName ?? r.wardenId)}</span>
        <span>${r.diffIcon ?? ''} ${r.diffName ?? r.diffId}</span>
        <span>${waves}${asc}</span>
      </div>`;
    }).join('');
    return `<div class="summary-run-history">
      <div class="run-history-title">${isKo ? '최근 런' : 'Recent Runs'}</div>
      <div class="run-history-list">${items}</div>
    </div>`;
  }

  _xpPercent(rank, xp) {
    if (rank >= MAX_RANK) return 100;
    const cur  = xpForLevel(rank);
    const next = xpForLevel(rank + 1);
    return Math.min(100, ((xp - cur) / (next - cur)) * 100);
  }

  // XP 바 채우기 + 레벨업 처리
  _animateXP(meta) {
    const bar     = document.getElementById('xp-bar');
    const barNew  = document.getElementById('xp-bar-new');
    const rankDisp = document.getElementById('rank-display');
    if (!bar || !barNew) return;

    let currentRank = meta.rankBefore;
    let currentXP   = meta.xpBefore;
    const targetXP  = meta.xpAfter;
    const totalGain = meta.xpGained;

    if (totalGain <= 0) return;

    // 단계별로 레벨업 처리
    const steps = this._buildXPSteps(currentRank, currentXP, targetXP);
    let stepIdx = 0;

    const nextStep = () => {
      if (stepIdx >= steps.length) return;
      const step = steps[stepIdx++];

      // 바 채우기 애니메이션
      barNew.style.transition = `width ${step.duration}ms ease-in-out`;
      barNew.style.width = step.fillTo + '%';

      setTimeout(() => {
        if (step.levelUp) {
          // 레벨업 이펙트
          bar.style.width = '0%';
          barNew.style.transition = 'none';
          barNew.style.width = '0%';
          currentRank = step.newRank;
          rankDisp.textContent = step.newRank;
          // Force DOM reflow so consecutive rank-ups each restart the animation cleanly
          rankDisp.classList.remove('rank-up-flash');
          void rankDisp.offsetWidth;
          rankDisp.classList.add('rank-up-flash');
          setTimeout(() => rankDisp.classList.remove('rank-up-flash'), 600);

          // 다음 레벨 라벨 업데이트
          const nextLabel = document.getElementById('xp-label-next');
          const curLabel  = document.getElementById('xp-label-cur');
          if (curLabel) curLabel.textContent = i18n.t('rank_num', step.newRank);
          if (nextLabel) nextLabel.textContent = step.newRank < MAX_RANK ? i18n.t('rank_num', step.newRank + 1) : i18n.t('max_rank');
        }
        setTimeout(nextStep, 200);
      }, step.duration + 100);
    };

    setTimeout(nextStep, 300);
  }

  _buildXPSteps(startRank, startXP, targetXP) {
    const steps = [];
    let rank = startRank;
    let xp   = startXP;

    while (xp < targetXP && rank < MAX_RANK) {
      const nextThreshold = xpForLevel(rank + 1);
      if (targetXP >= nextThreshold) {
        // 이번 단계에서 레벨업
        const fillTo = 100;
        const dur = Math.min(800, Math.max(300, (nextThreshold - xp) * 4));
        steps.push({ fillTo, duration: dur, levelUp: true, newRank: rank + 1 });
        xp = nextThreshold;
        rank++;
      } else {
        // 레벨업 없이 부분 채우기
        const cur  = xpForLevel(rank);
        const next = xpForLevel(rank + 1);
        const fillTo = ((targetXP - cur) / (next - cur)) * 100;
        const dur = Math.min(1000, Math.max(400, (targetXP - xp) * 3));
        steps.push({ fillTo, duration: dur, levelUp: false });
        xp = targetXP;
      }
    }
    return steps;
  }

  // 언락 카드들 순차 팝업
  _animateUnlocks(unlocks) {
    const container = document.getElementById('summary-unlocks');
    if (!container) return;

    unlocks.forEach((unlock, i) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'unlock-item';
        const isKo = i18n.lang === 'ko';
        const uTitle = isKo ? (unlock.titleKo || unlock.title) : unlock.title;
        const uDesc  = isKo ? (unlock.descKo  || unlock.desc)  : unlock.desc;
        el.innerHTML = `
          <span class="unlock-icon">${unlock.icon}</span>
          <div class="unlock-info">
            <div class="unlock-title">${i18n.t('unlock_label', uTitle, unlock.rank)}</div>
            <div class="unlock-desc">${uDesc}</div>
          </div>
        `;
        el.style.animation = 'unlockPop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        container.appendChild(el);
      }, 1200 + i * 600);
    });
  }

  _bindButtons() {
    document.getElementById('sum-continue')?.addEventListener('click', () => {
      this.container.classList.add('hidden');
      this._onContinue?.();
    });
    document.getElementById('sum-retry')?.addEventListener('click', () => {
      this.container.classList.add('hidden');
      this._onRetry?.();
    });
    document.getElementById('sum-menu')?.addEventListener('click', () => {
      this.container.classList.add('hidden');
      this._onMenu?.();
    });
  }
}
