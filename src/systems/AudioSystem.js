/**
 * Runewarden AudioSystem — Web Audio API 절차적 사운드 합성
 * 외부 파일 없이 모든 SFX를 코드로 생성합니다.
 *
 * 사용법:
 *   const audio = new AudioSystem();
 *   audio.play('card_play');
 *   audio.setMasterVolume(0.5);
 */
export class AudioSystem {
  constructor() {
    this._ctx    = null;
    this._master = null;   // GainNode
    this._muted  = false;
    this._volume = 0.7;
    this._init();
  }

  // ── 초기화 ────────────────────────────────────────────
  _init() {
    try {
      this._ctx    = new (window.AudioContext || window.webkitAudioContext)();
      this._master = this._ctx.createGain();
      this._master.gain.value = this._volume;
      this._master.connect(this._ctx.destination);
    } catch (e) {
      console.warn('[AudioSystem] Web Audio API 미지원:', e.message);
    }
  }

  // AudioContext는 사용자 제스처 이후에만 resume 가능
  _resume() {
    if (this._ctx?.state === 'suspended') this._ctx.resume();
  }

  // ── 공개 API ──────────────────────────────────────────
  setMasterVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(this._volume, this._ctx.currentTime, 0.01);
    }
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(this._muted ? 0 : this._volume, this._ctx.currentTime, 0.01);
    }
    return this._muted;
  }

  get isMuted() { return this._muted; }

  /** 효과음 재생 */
  play(id, opts = {}) {
    if (!this._ctx || this._muted) return;
    this._resume();
    const fn = this._sounds[id];
    if (fn) fn.call(this, opts);
    else console.warn('[AudioSystem] Unknown sound:', id);
  }

  // ── 내부 합성 헬퍼 ─────────────────────────────────
  _ctx_t()  { return this._ctx.currentTime; }
  _gain(vol = 1) {
    const g = this._ctx.createGain();
    g.gain.value = vol;
    g.connect(this._master);
    return g;
  }

  /** 단순 오실레이터 음표 */
  _tone({ freq = 440, type = 'sine', vol = 0.3, dur = 0.15, attack = 0.005, decay = 0.1, t0 } = {}) {
    if (!this._ctx) return;
    const now = t0 ?? this._ctx_t();
    const osc = this._ctx.createOscillator();
    const env = this._gain(0);

    osc.type      = type;
    osc.frequency.value = freq;
    osc.connect(env);
    osc.start(now);
    osc.stop(now + dur + 0.05);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(vol, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  }

  /** 노이즈 버스트 (폭발, 충격 등) */
  _noise({ vol = 0.4, dur = 0.12, attack = 0.002, decay = 0.1, t0,
           filterFreq = 1000, filterQ = 1 } = {}) {
    if (!this._ctx) return;
    const now     = t0 ?? this._ctx_t();
    const bufSize = Math.floor(this._ctx.sampleRate * (dur + 0.1));
    const buf     = this._ctx.createBuffer(1, bufSize, this._ctx.sampleRate);
    const data    = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src    = this._ctx.createBufferSource();
    const filter = this._ctx.createBiquadFilter();
    const env    = this._gain(0);

    src.buffer = buf;
    filter.type            = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value         = filterQ;

    src.connect(filter);
    filter.connect(env);
    src.start(now);
    src.stop(now + dur + 0.1);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(vol, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  }

  /** 주파수 슬라이드 */
  _sweep({ startFreq = 800, endFreq = 200, type = 'sawtooth', vol = 0.25, dur = 0.2,
           attack = 0.005, t0 } = {}) {
    if (!this._ctx) return;
    const now = t0 ?? this._ctx_t();
    const osc = this._ctx.createOscillator();
    const env = this._gain(0);

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + dur);
    osc.connect(env);
    osc.start(now);
    osc.stop(now + dur + 0.05);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(vol, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  }

  // ── 사운드 정의 ────────────────────────────────────────
  _sounds = {
    // ── 카드 관련 ────────────────────────────────────────
    /** 카드 클릭 선택 */
    card_select() {
      this._tone({ freq: 520, type: 'sine', vol: 0.18, dur: 0.08, decay: 0.06 });
    },
    /** 카드 플레이 (소환/강화/주문 공통) */
    card_play() {
      this._sweep({ startFreq: 320, endFreq: 640, type: 'sine', vol: 0.22, dur: 0.18 });
    },
    /** 타워 소환 */
    tower_place() {
      const t = this._ctx_t();
      this._sweep({ startFreq: 200, endFreq: 500, type: 'triangle', vol: 0.28, dur: 0.12, t0: t });
      this._tone({ freq: 660, type: 'sine', vol: 0.2, dur: 0.18, attack: 0.05, decay: 0.12, t0: t + 0.1 });
    },
    /** 강화 적용 */
    augment_apply() {
      const t = this._ctx_t();
      [400, 530, 680].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.15, dur: 0.1, decay: 0.08, t0: t + i * 0.05 });
      });
    },

    // ── 전투 ─────────────────────────────────────────────
    /** Archer 발사 */
    arrow_shoot() {
      this._sweep({ startFreq: 900, endFreq: 300, type: 'sawtooth', vol: 0.12, dur: 0.08 });
    },
    /** Cannon 발사 */
    cannon_fire() {
      this._noise({ vol: 0.45, dur: 0.15, decay: 0.12, filterFreq: 180, filterQ: 0.5 });
      this._tone({ freq: 80, type: 'sine', vol: 0.3, dur: 0.2, decay: 0.15 });
    },
    /** Cannon 폭발 */
    cannon_explode() {
      this._noise({ vol: 0.55, dur: 0.25, attack: 0.003, decay: 0.22, filterFreq: 250, filterQ: 0.4 });
    },
    /** Frost 발사 */
    frost_shoot() {
      this._sweep({ startFreq: 1200, endFreq: 600, type: 'sine', vol: 0.14, dur: 0.12 });
      this._tone({ freq: 1400, type: 'sine', vol: 0.08, dur: 0.1, decay: 0.08 });
    },
    /** Fire Drake 발사 */
    fire_shoot() {
      this._noise({ vol: 0.3, dur: 0.1, decay: 0.08, filterFreq: 600, filterQ: 0.8 });
      this._sweep({ startFreq: 250, endFreq: 500, type: 'sawtooth', vol: 0.18, dur: 0.1 });
    },
    /** Tesla 체인 번개 */
    tesla_zap() {
      this._noise({ vol: 0.35, dur: 0.06, decay: 0.05, filterFreq: 3000, filterQ: 2 });
      this._tone({ freq: 1800, type: 'square', vol: 0.08, dur: 0.06, decay: 0.04 });
    },
    /** Druid 발사 */
    druid_shoot() {
      this._tone({ freq: 330, type: 'sine', vol: 0.15, dur: 0.18, decay: 0.14 });
      this._tone({ freq: 440, type: 'sine', vol: 0.1, dur: 0.18, attack: 0.04, decay: 0.1 });
    },

    // ── 적 ───────────────────────────────────────────────
    /** 일반 적 사망 */
    enemy_die() {
      this._sweep({ startFreq: 320, endFreq: 80, type: 'triangle', vol: 0.2, dur: 0.18 });
    },
    /** 탱크 사망 */
    tank_die() {
      this._noise({ vol: 0.4, dur: 0.2, decay: 0.18, filterFreq: 150, filterQ: 0.4 });
      this._sweep({ startFreq: 200, endFreq: 60, type: 'sawtooth', vol: 0.25, dur: 0.25 });
    },
    /** 엘리트 사망 */
    elite_die() {
      const t = this._ctx_t();
      this._noise({ vol: 0.35, dur: 0.15, decay: 0.12, filterFreq: 300, filterQ: 0.6, t0: t });
      this._sweep({ startFreq: 400, endFreq: 100, type: 'sawtooth', vol: 0.22, dur: 0.2, t0: t });
    },
    /** 보스 피격 */
    boss_hit() {
      this._noise({ vol: 0.4, dur: 0.12, decay: 0.1, filterFreq: 200, filterQ: 0.5 });
      this._tone({ freq: 110, type: 'sine', vol: 0.2, dur: 0.15, decay: 0.12 });
    },
    /** 보스 사망 (웅장하게) */
    boss_die() {
      const t = this._ctx_t();
      // 폭발음
      this._noise({ vol: 0.7, dur: 0.4, attack: 0.003, decay: 0.38, filterFreq: 200, filterQ: 0.3, t0: t });
      // 하강 톤
      this._sweep({ startFreq: 400, endFreq: 50, type: 'sawtooth', vol: 0.4, dur: 0.5, t0: t });
      // 승리 음정 (딜레이)
      [523, 659, 784, 1047].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.25, dur: 0.3, attack: 0.02, decay: 0.25, t0: t + 0.4 + i * 0.12 });
      });
    },

    // ── 넥서스 ───────────────────────────────────────────
    /** 넥서스 피격 */
    nexus_hit() {
      const t = this._ctx_t();
      this._noise({ vol: 0.5, dur: 0.2, decay: 0.18, filterFreq: 400, filterQ: 0.8, t0: t });
      this._sweep({ startFreq: 220, endFreq: 110, type: 'square', vol: 0.3, dur: 0.3, t0: t });
      // 경보음 2회
      [0.05, 0.2].forEach(d => {
        this._tone({ freq: 880, type: 'square', vol: 0.2, dur: 0.1, decay: 0.08, t0: t + d });
      });
    },
    /** 넥서스 HP 회복 */
    nexus_heal() {
      const t = this._ctx_t();
      [440, 554, 659].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.2, dur: 0.2, attack: 0.01, decay: 0.15, t0: t + i * 0.07 });
      });
    },

    // ── 웨이브·게임 흐름 ─────────────────────────────────
    /** 웨이브 시작 */
    wave_start() {
      const t = this._ctx_t();
      [220, 277, 330].forEach((f, i) => {
        this._tone({ freq: f, type: 'sawtooth', vol: 0.15, dur: 0.15, decay: 0.12, t0: t + i * 0.07 });
      });
    },
    /** 보스 웨이브 시작 경고 */
    boss_warning() {
      const t = this._ctx_t();
      // 낮고 불길한 펄스
      [0, 0.18, 0.36].forEach(d => {
        this._tone({ freq: 55, type: 'sawtooth', vol: 0.3, dur: 0.14, decay: 0.1, t0: t + d });
      });
      this._sweep({ startFreq: 110, endFreq: 440, type: 'sine', vol: 0.2, dur: 0.6, t0: t + 0.5 });
    },
    /** 웨이브 클리어 */
    wave_clear() {
      const t = this._ctx_t();
      [523, 659, 784, 1047].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.2, dur: 0.2, attack: 0.01, decay: 0.16, t0: t + i * 0.08 });
      });
    },
    /** 승리 */
    victory() {
      const t = this._ctx_t();
      const melody = [523, 659, 784, 659, 784, 1047];
      melody.forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.22, dur: 0.25, attack: 0.01, decay: 0.2, t0: t + i * 0.13 });
      });
    },
    /** 패배 */
    defeat() {
      const t = this._ctx_t();
      [440, 370, 311, 277].forEach((f, i) => {
        this._tone({ freq: f, type: 'sawtooth', vol: 0.2, dur: 0.22, decay: 0.2, t0: t + i * 0.15 });
      });
    },

    // ── UI/상점 ──────────────────────────────────────────
    /** 골드 획득 */
    gold_gain() {
      const t = this._ctx_t();
      [1047, 1319].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.14, dur: 0.1, decay: 0.08, t0: t + i * 0.05 });
      });
    },
    /** 상점 구매 */
    shop_buy() {
      const t = this._ctx_t();
      [440, 554, 659, 880].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.14, dur: 0.12, decay: 0.09, t0: t + i * 0.04 });
      });
    },
    /** 상점 리롤 */
    shop_reroll() {
      this._sweep({ startFreq: 600, endFreq: 300, type: 'sine', vol: 0.18, dur: 0.15 });
      this._sweep({ startFreq: 300, endFreq: 600, type: 'sine', vol: 0.18, dur: 0.15,
        t0: this._ctx_t() + 0.12 });
    },
    /** 버튼 클릭 (일반) */
    ui_click() {
      this._tone({ freq: 440, type: 'sine', vol: 0.1, dur: 0.06, decay: 0.05 });
    },
    /** 일시정지 */
    ui_pause() {
      this._tone({ freq: 330, type: 'sine', vol: 0.12, dur: 0.12, decay: 0.1 });
      this._tone({ freq: 277, type: 'sine', vol: 0.12, dur: 0.12, decay: 0.1,
        t0: this._ctx_t() + 0.06 });
    },
    /** 주문 (마법 이펙트) */
    spell_cast() {
      const t = this._ctx_t();
      this._sweep({ startFreq: 400, endFreq: 1200, type: 'sine', vol: 0.2, dur: 0.2, t0: t });
      this._noise({ vol: 0.15, dur: 0.15, decay: 0.12, filterFreq: 2000, filterQ: 3, t0: t + 0.05 });
    },
    /** 슬로우/빙결 */
    spell_freeze() {
      const t = this._ctx_t();
      [800, 1000, 1200, 1000, 800].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', vol: 0.1, dur: 0.1, decay: 0.08, t0: t + i * 0.04 });
      });
    },
  };
}

// ── 싱글턴 인스턴스 ───────────────────────────────────────
export const audio = new AudioSystem();

/* ═══════════════════════════════════════════════════════════
 *  MusicSystem — 절차적 루프 BGM (3트랙)
 *  - menu  : 신비로운 아르페지오 패드
 *  - game  : 긴장감 있는 전투 루프
 *  - boss  : 불길한 드론 + 불규칙 리듬
 * ═══════════════════════════════════════════════════════════*/
class MusicSystem {
  constructor(ctx, masterGain) {
    this._ctx      = ctx;
    this._master   = masterGain;
    this._track    = null;   // 현재 트랙 이름
    this._nodes    = [];     // 중지할 때 정리할 노드들
    this._musicGain = null;  // 음악 전용 GainNode
    this._vol      = 0.28;   // 음악 기본 볼륨 (SFX보다 낮게)
    this._timers   = [];     // setTimeout IDs
  }

  // ── 내부 유틸 ─────────────────────────────────────────
  _t()    { return this._ctx?.currentTime ?? 0; }
  _g(vol) {
    const g = this._ctx.createGain();
    g.gain.value = vol;
    g.connect(this._musicGain);
    this._nodes.push(g);
    return g;
  }

  /** 지속 오실레이터 (루프 전용) */
  _osc({ freq, type = 'sine', detune = 0 }) {
    const o = this._ctx.createOscillator();
    o.type    = type;
    o.frequency.value = freq;
    o.detune.value    = detune;
    this._nodes.push(o);
    return o;
  }

  /** LFO로 게인을 진폭 변조 */
  _lfo({ rate = 0.5, depth = 0.08, target }) {
    const lfo  = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    lfo.frequency.value = rate;
    gain.gain.value     = depth;
    lfo.connect(gain);
    gain.connect(target);
    lfo.start();
    this._nodes.push(lfo, gain);
  }

  /** 저역 통과 필터 */
  _lpf(freq, Q = 1) {
    const f = this._ctx.createBiquadFilter();
    f.type            = 'lowpass';
    f.frequency.value = freq;
    f.Q.value         = Q;
    this._nodes.push(f);
    return f;
  }

  /** 예약된 짧은 음표 (스케줄드 아르페지오) */
  _note({ freq, vol, dur, attack, t0, type = 'sine' }) {
    const o   = this._ctx.createOscillator();
    const env = this._ctx.createGain();
    const lpf = this._lpf(freq * 4);

    o.type = type;
    o.frequency.value = freq;
    o.connect(lpf);
    lpf.connect(env);
    env.connect(this._musicGain);

    o.start(t0);
    o.stop(t0 + dur + 0.05);

    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(vol, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + dur);
    return o;
  }

  // ── 트랙 시작/정지 ───────────────────────────────────
  play(trackName) {
    if (!this._ctx) return;
    if (this._track === trackName) return;
    this.stop(true);
    this._track = trackName;

    // 음악 전용 gain 생성
    this._musicGain = this._ctx.createGain();
    this._musicGain.gain.value = 0;
    this._musicGain.connect(this._master);

    // 페이드인
    this._musicGain.gain.linearRampToValueAtTime(
      this._vol, this._ctx.currentTime + 2.5
    );

    const tracks = {
      menu:  () => this._buildMenuTrack(),
      game:  () => this._buildGameTrack(),
      boss:  () => this._buildBossTrack(),
    };
    tracks[trackName]?.();
  }

  stop(immediate = false) {
    if (!this._musicGain) return;

    const fadeTime = immediate ? 0.1 : 2.0;
    this._musicGain.gain.cancelScheduledValues(this._ctx.currentTime);
    this._musicGain.gain.setTargetAtTime(0, this._ctx.currentTime, fadeTime / 4);

    const delay = immediate ? 150 : fadeTime * 1000 + 200;
    setTimeout(() => {
      this._nodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch {} });
      this._musicGain?.disconnect();
      this._nodes      = [];
      this._musicGain  = null;
    }, delay);

    this._timers.forEach(clearTimeout);
    this._timers = [];
    this._track  = null;
  }

  crossfadeTo(trackName) {
    if (this._track === trackName) return;
    this.stop(false);
    // 페이드아웃 후 새 트랙 시작
    const tid = setTimeout(() => this.play(trackName), 1800);
    this._timers.push(tid);
  }

  setVolume(v) {
    this._vol = Math.max(0, Math.min(1.0, v));  // 0.5 → 1.0 (불필요한 상한선 제거)
    if (this._musicGain) {
      this._musicGain.gain.setTargetAtTime(this._vol, this._ctx.currentTime, 0.1);
    }
  }

  // ══════════════════════════════════════════════════════
  //  TRACK: MENU — 신비로운 드론 + D단조 아르페지오
  //  Key: D minor | BPM: ~52 | Loop: ~24s
  // ══════════════════════════════════════════════════════
  _buildMenuTrack() {
    const ctx = this._ctx;

    // 1) 베이스 드론 (D2 = 73.4 Hz)
    const droneFreqs = [73.4, 110.0, 146.8]; // D2, A2, D3
    for (const freq of droneFreqs) {
      const o   = this._osc({ freq, type: 'sine' });
      const lpf = this._lpf(300, 0.8);
      const g   = this._g(freq === 73.4 ? 0.12 : 0.05);
      o.connect(lpf); lpf.connect(g);
      this._lfo({ rate: 0.18, depth: 0.03, target: g.gain });
      o.start();
    }

    // 2) 패드 레이어 (상위 하모닉스, 약하게)
    const padO = this._osc({ freq: 220.0, type: 'triangle', detune: 8 }); // A3
    const padLPF = this._lpf(600, 1.5);
    const padG   = this._g(0.06);
    padO.connect(padLPF); padLPF.connect(padG);
    this._lfo({ rate: 0.08, depth: 0.04, target: padG.gain });
    padO.start();

    // 3) 아르페지오 — Dm 스케일 음표 (반복 루프)
    // D3=146.8 F3=174.6 A3=220 C4=261.6 D4=293.7 F4=349.2
    const arpNotes = [146.8, 174.6, 220.0, 261.6, 220.0, 174.6, 293.7, 220.0];
    const arpInterval = 1.15; // 초
    const loopLen     = arpNotes.length * arpInterval; // ~9.2s

    const scheduleArp = (startOffset = 0) => {
      const now = ctx.currentTime;
      arpNotes.forEach((freq, i) => {
        const t  = now + startOffset + i * arpInterval;
        const hi = i === 3 || i === 6; // 강조 음표
        this._note({ freq, vol: hi ? 0.07 : 0.045, dur: 0.9, attack: 0.08, t0: t });
      });

      // 루프 스케줄
      const tid = setTimeout(() => scheduleArp(), (startOffset + loopLen) * 1000 - 500);
      this._timers.push(tid);
    };
    scheduleArp(0.5);
  }

  // ══════════════════════════════════════════════════════
  //  TRACK: GAME — 긴장감 있는 전투 루프
  //  Key: D minor | BPM: ~80 | Loop: ~16s
  // ══════════════════════════════════════════════════════
  _buildGameTrack() {
    const ctx = this._ctx;

    // 1) 저음 드론 (빠른 LFO로 긴장감)
    const drone = this._osc({ freq: 73.4, type: 'sawtooth' });
    const dLPF  = this._lpf(180, 0.7);
    const dGain = this._g(0.08);
    drone.connect(dLPF); dLPF.connect(dGain);
    this._lfo({ rate: 0.35, depth: 0.04, target: dGain.gain });
    drone.start();

    // 2) 리듬 펄스 (퍼커시브 저음, 80 BPM = 0.75s 간격)
    const beatInterval = 0.75;
    const scheduleBeat = () => {
      const now = ctx.currentTime;
      for (let i = 0; i < 16; i++) {
        const t   = now + i * beatInterval;
        const acc = i % 4 === 0; // 강박

        // 베이스 드럼 느낌
        const o   = ctx.createOscillator();
        const env = ctx.createGain();
        o.frequency.setValueAtTime(acc ? 80 : 60, t);
        o.frequency.exponentialRampToValueAtTime(30, t + 0.15);
        o.type = 'sine';
        o.connect(env); env.connect(this._musicGain);
        o.start(t); o.stop(t + 0.2);
        env.gain.setValueAtTime(acc ? 0.22 : 0.12, t);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        this._nodes.push(o, env);
      }

      const loopMs = 16 * beatInterval * 1000;
      const tid = setTimeout(scheduleBeat, loopMs - 300);
      this._timers.push(tid);
    };
    scheduleBeat();

    // 3) 멜로디 오스티나토 (반복 모티프)
    // D3-F3-A3 를 빠르게 (강조 코드감)
    const ostNotes = [146.8, 174.6, 220.0, 174.6, 146.8, 220.0, 174.6, 110.0];
    const ostInterval = 0.375; // 80BPM 8분음표
    const scheduleOst = () => {
      const now = ctx.currentTime;
      ostNotes.forEach((freq, i) => {
        const t = now + i * ostInterval;
        this._note({ freq, vol: 0.038, dur: 0.28, attack: 0.02, t0: t, type: 'triangle' });
      });
      const tid = setTimeout(scheduleOst, ostNotes.length * ostInterval * 1000 - 200);
      this._timers.push(tid);
    };
    scheduleOst();
  }

  // ══════════════════════════════════════════════════════
  //  TRACK: BOSS — 불길한 드론 + 불규칙 타악기
  //  Dark Drone in Dm | 느리고 위협적
  // ══════════════════════════════════════════════════════
  _buildBossTrack() {
    const ctx = this._ctx;

    // 1) 깊은 드론 레이어
    const drones = [
      { freq: 55.0,  type: 'sawtooth', vol: 0.14 }, // A1
      { freq: 73.4,  type: 'square',   vol: 0.06 }, // D2
      { freq: 82.4,  type: 'sine',     vol: 0.08 }, // E2 (불협)
    ];
    for (const { freq, type, vol } of drones) {
      const o   = this._osc({ freq, type });
      const lpf = this._lpf(200, 0.6);
      const g   = this._g(vol);
      o.connect(lpf); lpf.connect(g);
      this._lfo({ rate: 0.12 + Math.random() * 0.1, depth: 0.05, target: g.gain });
      o.start();
    }

    // 2) 트레몰로 패드 (불안한 진동)
    const trem = this._osc({ freq: 110.0, type: 'triangle' }); // A2
    const tLPF = this._lpf(400);
    const tG   = this._g(0.07);
    trem.connect(tLPF); tLPF.connect(tG);
    this._lfo({ rate: 6.5, depth: 0.065, target: tG.gain }); // 빠른 트레몰로
    trem.start();

    // 3) 불규칙 타격음 (위협적 리듬)
    const pattern = [0, 1.1, 1.8, 3.2, 4.0, 5.3, 6.0, 7.5]; // 비규칙 타이밍
    const scheduleHits = () => {
      const now = ctx.currentTime;
      for (const offset of pattern) {
        const t   = now + offset;
        const o   = ctx.createOscillator();
        const env = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(55, t);
        o.frequency.exponentialRampToValueAtTime(20, t + 0.3);
        o.connect(env); env.connect(this._musicGain);
        o.start(t); o.stop(t + 0.35);
        env.gain.setValueAtTime(0.28, t);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        this._nodes.push(o, env);
      }
      const loopMs = (pattern[pattern.length - 1] + 1.5) * 1000;
      const tid = setTimeout(scheduleHits, loopMs - 400);
      this._timers.push(tid);
    };
    scheduleHits();

    // 4) 고음 불협음 (공포감 조성)
    const shriek = this._osc({ freq: 440.0, type: 'sine', detune: 15 }); // A4 + 미세 디튠
    const sLPF   = this._lpf(500, 3);
    const sG     = this._g(0.025);
    shriek.connect(sLPF); sLPF.connect(sG);
    this._lfo({ rate: 0.07, depth: 0.022, target: sG.gain });
    shriek.start();
  }
}

// MusicSystem 싱글턴 (AudioSystem과 AudioContext 공유)
class _MusicBridge {
  constructor() { this._music = null; }
  _ensure() {
    if (!this._music && audio._ctx) {
      this._music = new MusicSystem(audio._ctx, audio._master);
    }
    return this._music;
  }
  play(track)             { this._ensure()?.play(track); }
  stop(immediate = false) { this._ensure()?.stop(immediate); }
  crossfadeTo(track)      { this._ensure()?.crossfadeTo(track); }
  setVolume(v)            { this._ensure()?.setVolume(v); }
}
export const music = new _MusicBridge();
