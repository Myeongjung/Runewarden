/**
 * Runewarden i18n — 다국어 지원 엔진
 *
 * 사용법:
 *   import { i18n } from '../i18n/i18n.js';
 *   i18n.t('btn_new_run')          // → 'New Run' | '새 런 시작'
 *   i18n.t('stat_runs', 8)         // → 'Runs: 8' | '런: 8'
 *   i18n.setLang('ko')             // 언어 전환 + 화면 즉시 갱신
 */

import en from './en.js';
import ko from './ko.js';

const TRANSLATIONS = { en, ko };
const STORAGE_KEY  = 'rw_lang';
const SUPPORTED    = ['en', 'ko'];

class I18n {
  constructor() {
    // 저장된 언어 → 브라우저 언어 → 기본 영어
    const saved    = localStorage.getItem(STORAGE_KEY);
    const browser  = navigator.language?.startsWith('ko') ? 'ko' : 'en';
    this._lang     = SUPPORTED.includes(saved) ? saved : browser;
    this._dict     = TRANSLATIONS[this._lang];
    this._listeners = [];
  }

  get lang() { return this._lang; }

  /** 번역 함수: 키 + 선택적 인자 */
  t(key, ...args) {
    const val = this._dict[key];
    if (val === undefined) {
      console.warn(`[i18n] Missing key "${key}" in lang "${this._lang}"`);
      return key;
    }
    return typeof val === 'function' ? val(...args) : val;
  }

  /** 언어 전환 */
  setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    this._lang = lang;
    this._dict = TRANSLATIONS[lang];
    localStorage.setItem(STORAGE_KEY, lang);
    this._applyDOM();
    this._listeners.forEach(fn => fn(lang));
  }

  /** 언어 변경 콜백 등록 */
  onChange(fn) { this._listeners.push(fn); }

  /**
   * DOM 자동 적용
   * - [data-i18n="key"]       → textContent 갱신
   * - [data-i18n-html="key"]  → innerHTML 갱신
   * - [data-i18n-val="key"] + [data-i18n-n="N"] → t(key, N) 갱신
   */
  _applyDOM() {
    // 단순 텍스트
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = this.t(key);
      if (typeof val === 'string') el.textContent = val;
    });

    // HTML 삽입 (howto 등)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const val = this.t(key);
      if (typeof val === 'string') el.innerHTML = val;
    });

    // 값이 있는 통계 등 (stat_runs + n)
    document.querySelectorAll('[data-i18n-val]').forEach(el => {
      const key = el.dataset.i18nVal;
      const n   = el.dataset.i18nN ?? '';
      el.textContent = this.t(key, n);
    });

    // placeholder 처리
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      el.placeholder = this.t(key);
    });

    // 언어 버튼 active 상태
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this._lang);
    });
  }

  /** 초기 DOM 적용 (DOMContentLoaded 이후 호출) */
  init() {
    this._applyDOM();
    // 언어 버튼 이벤트 연결
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
    });
  }
}

export const i18n = new I18n();
