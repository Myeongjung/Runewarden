/**
 * Runewarden — 인터랙티브 튜토리얼 시스템
 *
 * 특징:
 * - 스포트라이트 (타겟 요소를 밝게, 나머지 어둡게)
 * - 말풍선 (방향 자동 감지)
 * - 액션 기반 자동 진행 (카드 클릭, 타워 배치 등)
 * - localStorage 완료 플래그 (두 번째 실행 시 스킵)
 */
import { i18n } from '../i18n/i18n.js';

const TUTORIAL_DONE_KEY = 'rw_tutorial_v1_done';

// ── 튜토리얼 스텝 정의 ────────────────────────────────
// targetSelector: 스포트라이트 대상 CSS 셀렉터 (null = 전체화면 다크)
// triggerEvent:   이 이벤트가 발생하면 자동으로 다음 스텝으로
// autoAdvance:    ms 후 자동 진행 (null = 버튼 클릭만)
function getSteps() {
  return [
    {
      id: 'welcome',
      targetSelector: null,
      title: i18n.t('tut_welcome_title'),
      text:  i18n.t('tut_welcome_text'),
      btnLabel: i18n.t('tut_welcome_btn'),
      position: 'center',
    },
    {
      id: 'show_path',
      targetSelector: '#map-area',
      title: i18n.t('tut_path_title'),
      text:  i18n.t('tut_path_text'),
      btnLabel: i18n.t('tut_path_btn'),
      position: 'right',
    },
    {
      id: 'show_green',
      targetSelector: '#map-area',
      title: i18n.t('tut_green_title'),
      text:  i18n.t('tut_green_text'),
      btnLabel: i18n.t('tut_green_btn'),
      position: 'right',
    },
    {
      id: 'select_card',
      targetSelector: '#card-hand',
      title: i18n.t('tut_select_title'),
      text:  i18n.t('tut_select_text'),
      btnLabel: null,   // 액션 대기
      position: 'left',
      triggerEvent: 'card_selected_summon',
    },
    {
      id: 'place_tower',
      targetSelector: '#map-area',
      title: i18n.t('tut_place_title'),
      text:  i18n.t('tut_place_text'),
      btnLabel: null,
      position: 'right',
      triggerEvent: 'tower_placed',
    },
    {
      id: 'start_wave',
      targetSelector: '#btn-wave',
      title: i18n.t('tut_wave_title'),
      text:  i18n.t('tut_wave_text'),
      btnLabel: null,
      position: 'left',
      triggerEvent: 'wave_started',
    },
    {
      id: 'watch_combat',
      targetSelector: '#map-area',
      title: i18n.t('tut_combat_title'),
      text:  i18n.t('tut_combat_text'),
      btnLabel: i18n.t('tut_combat_btn'),
      position: 'right',
      autoAdvance: 4000,
    },
    {
      id: 'show_hud',
      targetSelector: '#hud',
      title: i18n.t('tut_hud_title'),
      text:  i18n.t('tut_hud_text'),
      btnLabel: i18n.t('tut_hud_btn'),
      position: 'left',
    },
    {
      id: 'done',
      targetSelector: null,
      title: i18n.t('tut_done_title'),
      text:  i18n.t('tut_done_text'),
      btnLabel: i18n.t('tut_done_btn'),
      position: 'center',
    },
  ];
}

// ── TutorialUI 클래스 ─────────────────────────────────
export class TutorialUI {
  constructor(callbacks) {
    this.onComplete    = callbacks.onComplete ?? (() => {});
    this.onStepChange  = callbacks.onStepChange ?? (() => {});
    this._stepIdx      = 0;
    this._overlay      = null;
    this._bubble       = null;
    this._spotlight    = null;
    this._autoTimer    = null;
    this._active       = false;
    this._injectStyles();
  }

  // ── 완료 여부 확인 ────────────────────────────────
  static isDone() {
    return localStorage.getItem(TUTORIAL_DONE_KEY) === '1';
  }

  static markDone() {
    localStorage.setItem(TUTORIAL_DONE_KEY, '1');
  }

  static reset() {
    localStorage.removeItem(TUTORIAL_DONE_KEY);
  }

  // ── 튜토리얼 시작 ────────────────────────────────
  start() {
    if (this._active) return;
    this._active = true;
    this._stepIdx = 0;
    this._steps = getSteps();  // 현재 언어로 스텝 생성
    this._buildDOM();
    this._showStep(0);
  }

  // ── 외부에서 이벤트 트리거 ───────────────────────
  triggerEvent(eventName) {
    if (!this._active) return;
    const step = this._steps[this._stepIdx];
    if (step?.triggerEvent === eventName) {
      setTimeout(() => this._nextStep(), 600);
    }
  }

  isActive() { return this._active; }

  // ── DOM 구성 ──────────────────────────────────────
  _buildDOM() {
    // 기존 요소 정리
    document.getElementById('tut-overlay')?.remove();

    // 다크 오버레이 (스포트라이트 구멍 포함)
    this._overlay = document.createElement('div');
    this._overlay.id = 'tut-overlay';
    this._overlay.className = 'tut-overlay';
    document.body.appendChild(this._overlay);

    // SVG 스포트라이트 마스크
    this._spotlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._spotlight.id = 'tut-spotlight';
    this._spotlight.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:8999';
    document.body.appendChild(this._spotlight);

    // 말풍선
    this._bubble = document.createElement('div');
    this._bubble.id = 'tut-bubble';
    this._bubble.className = 'tut-bubble';
    document.body.appendChild(this._bubble);
  }

  // ── 스텝 표시 ─────────────────────────────────────
  _showStep(idx) {
    clearTimeout(this._autoTimer);
    const step = this._steps[idx];
    if (!step) { this._complete(); return; }

    // 액션 대기 스텝: 플레이어가 게임 UI를 클릭할 수 있도록 overlay 투과
    if (step.triggerEvent && this._overlay) {
      this._overlay.classList.add('allow-interact');
    } else if (this._overlay) {
      this._overlay.classList.remove('allow-interact');
    }

    // 스포트라이트 업데이트
    this._updateSpotlight(step.targetSelector);

    // 말풍선 업데이트
    this._updateBubble(step, idx);

    // 자동 진행
    if (step.autoAdvance) {
      this._autoTimer = setTimeout(() => {
        if (this._stepIdx === idx) this._nextStep();
      }, step.autoAdvance);
    }

    this.onStepChange(step.id, idx);
  }

  _updateSpotlight(selector) {
    this._spotlight.innerHTML = '';

    const W = window.innerWidth, H = window.innerHeight;
    const padding = 12;

    if (!selector) {
      // 전체 다크 — 구멍 없음
      this._overlay.style.background = 'rgba(0,0,0,0.82)';
      return;
    }

    const el = document.querySelector(selector);
    if (!el) {
      this._overlay.style.background = 'rgba(0,0,0,0.65)';
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = rect.left - padding;
    const y = rect.top  - padding;
    const w = rect.width  + padding * 2;
    const h = rect.height + padding * 2;
    const r = 10; // 모서리 반경

    // 전체 화면 다크 마스크 + 구멍
    const defs = `<defs>
      <mask id="tut-mask">
        <rect width="${W}" height="${H}" fill="white"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="black"/>
      </mask>
    </defs>`;

    const dark = `<rect width="${W}" height="${H}" fill="rgba(0,0,0,0.78)" mask="url(#tut-mask)"/>`;

    // 하이라이트 테두리
    const border = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"
      fill="none" stroke="rgba(212,175,55,0.7)" stroke-width="2"
      stroke-dasharray="8 5"/>`;

    // 코너 마커
    const cs = 12;
    const corners = [
      `M${x},${y+cs} L${x},${y} L${x+cs},${y}`,
      `M${x+w-cs},${y} L${x+w},${y} L${x+w},${y+cs}`,
      `M${x+w},${y+h-cs} L${x+w},${y+h} L${x+w-cs},${y+h}`,
      `M${x+cs},${y+h} L${x},${y+h} L${x},${y+h-cs}`,
    ].map(d => `<path d="${d}" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/>`).join('');

    this._spotlight.innerHTML = defs + dark + border + corners;
    this._overlay.style.background = 'transparent';

    // 스크롤하여 타겟 노출
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  _updateBubble(step, idx) {
    const isCenter  = step.position === 'center' || !step.targetSelector;
    const isLeft    = step.position === 'left';
    const progress  = `${idx + 1} / ${this._steps.length}`;

    this._bubble.className = `tut-bubble${isCenter ? ' tut-center' : ''}`;

    const btnHtml = step.btnLabel
      ? `<button class="tut-btn" id="tut-next-btn">${step.btnLabel}</button>`
      : `<div class="tut-waiting">${i18n.t('tut_waiting')} <span class="tut-pulse">●</span></div>
         <button class="tut-alt-btn" id="tut-alt-btn">${i18n.t('tut_manual_advance')}</button>`;

    this._bubble.innerHTML = `
      <div class="tut-progress">${progress}</div>
      <div class="tut-title">${step.title}</div>
      <div class="tut-text">${step.text.replace(/\n/g, '<br>')}</div>
      <div class="tut-footer">
        ${btnHtml}
        <button class="tut-skip-btn" id="tut-skip-btn">${i18n.t('tut_skip')}</button>
      </div>
    `;

    // 위치 설정 — 뷰포트 기준 안전 영역에 배치
    const VW = window.innerWidth, VH = window.innerHeight;
    const BW = 290, BH = 220; // 버블 예상 크기
    const pad = 16;

    if (isCenter) {
      this._bubble.style.cssText = `left:50%;top:50%;transform:translate(-50%,-50%);width:360px;text-align:center`;
    } else {
      const el = step.targetSelector ? document.querySelector(step.targetSelector) : null;
      let left, top;

      if (el) {
        const rect = el.getBoundingClientRect();
        // position 'right' → 타겟 오른쪽에 버블
        // position 'left'  → 타겟 왼쪽에 버블
        if (!isLeft) {
          // 오른쪽에 표시 (right panel 위)
          left = Math.min(VW - BW - pad, rect.right + pad);
          top  = Math.max(pad, Math.min(VH - BH - pad, rect.top + rect.height/2 - BH/2));
        } else {
          // 왼쪽에 표시 (map 위)
          left = Math.max(pad, rect.left - BW - pad);
          top  = Math.max(pad, Math.min(VH - BH - pad, rect.top + rect.height/2 - BH/2));
        }
      } else {
        left = VW - BW - pad;
        top  = VH / 2 - BH / 2;
      }

      // 화면 경계 클램핑
      left = Math.max(pad, Math.min(VW - BW - pad, left));
      top  = Math.max(pad, Math.min(VH - BH - pad, top));

      this._bubble.style.cssText = `left:${left}px;top:${top}px;transform:none`;
    }

    // 버튼 이벤트
    document.getElementById('tut-next-btn')?.addEventListener('click', () => this._nextStep());
    document.getElementById('tut-alt-btn')?.addEventListener('click',  () => this._nextStep());
    document.getElementById('tut-skip-btn')?.addEventListener('click', () => this._complete());

    // 등장 애니메이션
    this._bubble.style.animation = 'none';
    this._bubble.offsetHeight;
    this._bubble.style.animation = 'tutBubblePop 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  }

  _nextStep() {
    this._stepIdx++;
    if (this._stepIdx >= this._steps.length) {
      this._complete();
    } else {
      this._showStep(this._stepIdx);
    }
  }

  _complete() {
    clearTimeout(this._autoTimer);
    this._active = false;
    TutorialUI.markDone();

    // 페이드아웃
    if (this._overlay) this._overlay.style.animation = 'tutFadeOut 0.4s ease-out forwards';
    if (this._bubble)  this._bubble.style.animation  = 'tutFadeOut 0.3s ease-out forwards';

    setTimeout(() => {
      this._overlay?.remove();
      this._spotlight?.remove();
      this._bubble?.remove();
      this._overlay = this._spotlight = this._bubble = null;
    }, 400);

    this.onComplete();
  }

  // ── CSS 주입 ──────────────────────────────────────
  _injectStyles() {
    if (document.getElementById('tut-styles')) return;
    const s = document.createElement('style');
    s.id = 'tut-styles';
    s.textContent = `
      @keyframes tutBubblePop {
        0%   { opacity:0; transform:scale(0.85); }
        100% { opacity:1; transform:scale(1); }
      }
      @keyframes tutFadeOut {
        0%   { opacity:1; }
        100% { opacity:0; }
      }
      @keyframes tutPulse {
        0%,100% { opacity:1; } 50% { opacity:0.3; }
      }

      .tut-overlay {
        position: fixed; inset: 0;
        z-index: 8998;
        pointer-events: all;   /* 게임 UI 클릭 차단 */
        transition: background 0.3s;
      }
      /* 액션 대기 스텝에서만 게임 인터랙션 허용 */
      .tut-overlay.allow-interact {
        pointer-events: none;
      }

      .tut-bubble {
        position: fixed;
        z-index: 9001;
        background: linear-gradient(160deg, #1a1a3a, #12122a);
        border: 1px solid #D4AF37;
        border-radius: 12px;
        padding: 1.2rem 1.3rem;
        width: 280px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.15);
        pointer-events: all;
        font-family: 'Crimson Text', serif;
      }

      .tut-bubble.tut-center {
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        width: 360px;
        text-align: center;
      }

      .tut-progress {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.62rem;
        color: rgba(212,175,55,0.6);
        letter-spacing: 0.1em;
        margin-bottom: 0.4rem;
      }

      .tut-title {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #D4AF37;
        font-weight: 700;
        margin-bottom: 0.55rem;
        line-height: 1.25;
      }

      .tut-text {
        font-size: 0.88rem;
        color: #c0c0d8;
        line-height: 1.55;
        margin-bottom: 0.9rem;
      }

      .tut-footer {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .tut-btn {
        font-family: 'Cinzel', serif;
        font-size: 0.82rem;
        letter-spacing: 0.08em;
        padding: 0.5rem 1.2rem;
        background: linear-gradient(135deg, #8a6f1a, #D4AF37);
        color: #1A1A2E;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
        transition: filter 0.15s;
        width: 100%;
      }
      .tut-btn:hover { filter: brightness(1.1); }

      .tut-skip-btn {
        font-family: 'Cinzel', serif;
        font-size: 0.65rem;
        letter-spacing: 0.06em;
        padding: 0.3rem;
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.25);
        cursor: pointer;
        transition: color 0.15s;
        text-align: center;
      }
      .tut-skip-btn:hover { color: rgba(255,255,255,0.5); }

      .tut-alt-btn {
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        padding: 0.35rem 0.9rem;
        background: transparent;
        border: 1px solid rgba(212,175,55,0.35);
        border-radius: 5px;
        color: rgba(212,175,55,0.6);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
        width: 100%;
      }
      .tut-alt-btn:hover { border-color: rgba(212,175,55,0.7); color: #D4AF37; }

      .tut-waiting {
        font-size: 0.78rem;
        color: rgba(255,255,255,0.45);
        text-align: center;
        padding: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
      }
      .tut-pulse {
        color: #D4AF37;
        animation: tutPulse 1.2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(s);
  }
}
