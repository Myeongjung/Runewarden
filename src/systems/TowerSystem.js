// 타워 배치·공격·강화 시스템
import { hexToPixel, svgEl } from '../rendering/MapRenderer.js';
import { audio } from './AudioSystem.js';
import { HEX_W } from '../config/constants.js';

// SVG 필터 정의 (글로우 이펙트)
function ensureFilters(svg) {
  if (svg.querySelector('#glow-filter')) return;
  const defs = svgEl('defs');

  // 글로우 필터
  const filter = svgEl('filter', { id: 'glow-filter', x: '-50%', y: '-50%', width: '200%', height: '200%' });
  const blur = svgEl('feGaussianBlur', { stdDeviation: '3', result: 'blur' });
  const merge = svgEl('feMerge');
  const n1 = svgEl('feMergeNode', { in: 'blur' });
  const n2 = svgEl('feMergeNode', { in: 'SourceGraphic' });
  merge.appendChild(n1); merge.appendChild(n2);
  filter.appendChild(blur); filter.appendChild(merge);
  defs.appendChild(filter);
  svg.insertBefore(defs, svg.firstChild);
}

export class TowerSystem {
  constructor(projectileLayer, enemySystem, onLog) {
    this.towers = new Map();
    this.projectileLayer = projectileLayer;
    this.enemySystem = enemySystem;
    this.onLog = onLog;
    this._projId = 0;
    this._effectId = 0;
    // 글로벌 임시 버프 (스펠)
    this._globalSpeedMult  = 1;  // < 1 = 더 빠름 (쿨다운 감소)
    this._globalSpeedTimer = 0;
    this._globalDmgMult    = 1;  // > 1 = 더 강함
    this._globalDmgTimer   = 0;
    // 유물 영구 버프 (런 내 지속)
    this._relicDmgBonus    = {};   // { towerType: mult }
    this._relicRangeBonus  = {};
    this._relicSpeedBonus  = {};
    this._chainBonus       = 0;    // Tesla 추가 체인 수
    this._druidAuraBonus   = 0;    // Druid 버프 추가 배율
    this._relicSiegeSplash = 1;    // Cannon 폭발 반경 배율 (1 = 기본)
    this._relicFirePact    = 0;    // Fire Pact 추가 배율 (0 = 비활성)
    this._fireDrakeCount   = 0;    // 배치된 Fire Drake 수 캐시 (Fire Pact 최적화)
    ensureFilters(projectileLayer.ownerSVGElement);
    this._injectStyles();
  }

  // ── 유물 버프 등록 (stat: 'damage' | 'range' | 'speed') ──
  _STAT_MAP = {
    damage: { bonusKey: '_relicDmgBonus',   field: 'damage',        baseField: 'baseDamage' },
    range:  { bonusKey: '_relicRangeBonus', field: 'range',         baseField: 'baseRange' },
    speed:  { bonusKey: '_relicSpeedBonus', field: 'attackCooldown',baseField: 'baseAttackCooldown' },
  };

  _addRelicStatBonus(stat, towerType, mult) {
    const { bonusKey, field, baseField } = this._STAT_MAP[stat];
    this[bonusKey][towerType] = (this[bonusKey][towerType] ?? 1) * mult;
    const combined = this[bonusKey][towerType];
    for (const t of this.towers.values()) {
      if (t.def.id !== towerType) continue;
      t[baseField] = t[baseField] ?? t[field];
      t[field]     = t[baseField] * combined;
    }
  }

  addRelicDmgBonus(towerType, mult)   { this._addRelicStatBonus('damage', towerType, mult); }
  addRelicRangeBonus(towerType, mult) { this._addRelicStatBonus('range',  towerType, mult); }
  addRelicSpeedBonus(towerType, mult) { this._addRelicStatBonus('speed',  towerType, mult); }

  addChainBonus(extra) {
    this._chainBonus += extra;
  }

  addDruidAuraBonus(extraMult) {
    this._druidAuraBonus += extraMult;
  }

  // Siege Engine: Cannon 폭발 반경 배율 적용
  addSiegeSplash(mult) {
    this._relicSiegeSplash *= mult;
    for (const t of this.towers.values()) {
      if (t.def.id === 'cannon' && t.def.splash) {
        t.def.splash = (t._baseSplash ?? t.def.splash) * this._relicSiegeSplash;
        t._baseSplash = t._baseSplash ?? (t.def.splash / mult);
      }
    }
  }

  // Fire Pact: Fire Drake 데미지 보너스 설정
  addFirePact(extraMult) {
    this._relicFirePact = extraMult;
  }

  // Storm Circuit: 모든 Tesla 즉시 발사
  triggerAllTeslas() {
    let count = 0;
    for (const t of this.towers.values()) {
      if (t.def.id !== 'tesla') continue;
      const target = this.enemySystem.getLeadEnemy(t.x, t.y, t.range);
      if (!target) continue;
      this._fireAt(t, target);
      t.cooldown = t.attackSpeed * this._globalSpeedMult;
      count++;
    }
    return count;
  }

  // Void Echo Relic: 특정 태그를 가진 모든 타워 즉시 발사
  triggerAllByTag(tag) {
    let count = 0;
    for (const t of this.towers.values()) {
      if (!t.def.tags?.includes(tag)) continue;
      const target = this.enemySystem.getLeadEnemy(t.x, t.y, t.range);
      if (!target) continue;
      this._fireAt(t, target);
      t.cooldown = t.attackSpeed * this._globalSpeedMult;
      count++;
    }
    return count;
  }

  _injectStyles() {
    if (document.getElementById('tower-fx-style')) return;
    const s = document.createElement('style');
    s.id = 'tower-fx-style';
    s.textContent = `
      @keyframes towerPop   { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
      @keyframes muzzleFlash { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(2.5)} }
      @keyframes splashRing  { 0%{opacity:0.7;transform:scale(0.3)} 100%{opacity:0;transform:scale(1)} }
      @keyframes projFade    { 0%{opacity:0.9} 100%{opacity:0} }
      @keyframes dmgFloat    { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-28px)} }
    `;
    document.head.appendChild(s);
  }

  // ── 타워 배치 ─────────────────────────────────────────
  place(col, row, towerDef) {
    const key = `${col},${row}`;
    if (this.towers.has(key)) return false;
    const { x, y } = hexToPixel(col, row);
    const tid = towerDef.id;
    // 기본 스탯
    const baseDmg   = towerDef.damage;
    const baseRange = towerDef.range * HEX_W * 0.75;
    const baseSpd   = towerDef.attackSpeed;
    // 유물 버프 적용
    const dmgMult   = this._relicDmgBonus[tid]   ?? 1;
    const rangeMult = this._relicRangeBonus[tid]  ?? 1;
    const spdMult   = this._relicSpeedBonus[tid]  ?? 1;

    // Siege Engine: Cannon 폭발 반경 확대
    const defCopy = { ...towerDef };
    if (tid === 'cannon' && this._relicSiegeSplash > 1 && defCopy.splash) {
      defCopy._baseSplash = defCopy.splash;
      defCopy.splash = defCopy.splash * this._relicSiegeSplash;
    }

    if (tid === 'fire_drake') this._fireDrakeCount++;

    this.towers.set(key, {
      col, row, x, y,
      def: defCopy,
      damage:      baseDmg   * dmgMult,
      range:       baseRange * rangeMult,
      attackSpeed: baseSpd   * spdMult,
      baseDamage:       baseDmg,
      baseRange:        baseRange,
      baseAttackCooldown: baseSpd,
      cooldown: 0,
      augments: [],
    });
    return true;
  }

  // ── 강화 ─────────────────────────────────────────────
  augment(col, row, effect) {
    const t = this.towers.get(`${col},${row}`);
    if (!t) return false;
    if (t.augments.length >= 2) { this.onLog('Already has 2 augments!', 'bad'); return false; }

    // 다중 스탯 배열 지원 (stats) 또는 단일 스탯 (stat)
    const statList = effect.stats ?? [{ stat: effect.stat, mult: effect.mult }];
    for (const s of statList) {
      if (s.stat === 'damage')      t.damage      *= s.mult;
      if (s.stat === 'range')       t.range       *= s.mult;
      if (s.stat === 'attackSpeed') t.attackSpeed *= s.mult;
    }
    t.augments.push(effect);
    const label = statList.map(s => `${s.stat} ×${s.mult}`).join(', ');
    this.onLog(`Tower augmented: ${label}`, 'good');
    return true;
  }

  // ── 글로벌 버프 적용 ──────────────────────────────────
  applyGlobalSpeedBoost(mult, duration) {
    this._globalSpeedMult  = Math.min(this._globalSpeedMult, mult); // 더 빠른 쪽 선택
    this._globalSpeedTimer = Math.max(this._globalSpeedTimer, duration);
  }

  applyGlobalDamageBoost(mult, duration) {
    this._globalDmgMult  = Math.max(this._globalDmgMult, mult);
    this._globalDmgTimer = Math.max(this._globalDmgTimer, duration);
  }

  // ── 업데이트 ─────────────────────────────────────────
  update(delta) {
    // 글로벌 버프 타이머
    if (this._globalSpeedTimer > 0) {
      this._globalSpeedTimer -= delta;
      if (this._globalSpeedTimer <= 0) this._globalSpeedMult = 1;
    }
    if (this._globalDmgTimer > 0) {
      this._globalDmgTimer -= delta;
      if (this._globalDmgTimer <= 0) this._globalDmgMult = 1;
    }

    for (const t of this.towers.values()) {
      if (t.cooldown > 0) { t.cooldown -= delta; continue; }
      const target = this.enemySystem.getLeadEnemy(t.x, t.y, t.range);
      if (!target) continue;
      this._fireAt(t, target);
      t.cooldown = t.attackSpeed * this._globalSpeedMult;
    }
  }

  _fireAt(tower, enemy) {
    // Druid 오라 효과: 인접 Druid 타워가 있으면 대미지 +auraDmgMult
    const druidMult = this._getDruidAuraMult(tower);
    // Fire Pact: Fire Drake 2개 이상 배치 시 데미지 +extraMult
    let firePactMult = 1;
    if (this._relicFirePact > 0 && tower.def.id === 'fire_drake' && this._fireDrakeCount >= 2) {
      firePactMult = 1 + this._relicFirePact;
    }
    let dmg = Math.round(tower.damage * this._globalDmgMult * druidMult * firePactMult);

    // ── DLC: critOnSlow — 감속 적에게 크리티컬 ─────────────
    if (tower.def.critOnSlow && enemy.slowTimer > 0) {
      dmg = Math.round(dmg * tower.def.critOnSlow);
    }

    this.enemySystem.dealDamage(enemy.id, dmg);

    const ex = enemy.x, ey = enemy.y;
    const tx = tower.x, ty = tower.y;
    const tid = tower.def.id;

    // ── 발사체 타입별 처리 ───────────────────────────────
    if (tid === 'archer') {
      this._spawnArrow(tx, ty, ex, ey, tower.def.accentColor);
      audio.play('arrow_shoot');

    } else if (tid === 'cannon') {
      this._spawnCannonball(tx, ty, ex, ey);
      audio.play('cannon_fire');
      const splashPx = tower.def.splash * HEX_W * 0.75;
      setTimeout(() => {
        this._spawnSplashRing(ex, ey, splashPx, '#e74c3c');
        audio.play('cannon_explode');
        const inSplash = this.enemySystem.getEnemiesInRange(ex, ey, splashPx);
        for (const e of inSplash) {
          if (e.id !== enemy.id) this.enemySystem.dealDamage(e.id, Math.round(dmg * 0.6));
        }
      }, 180);

    } else if (tid === 'frost' || tid === 'glacial' || tid === 'frost_giant') {
      this._spawnIceBolt(tx, ty, ex, ey);
      this.enemySystem.applySlow(enemy.id, tower.def.slowEffect, tower.def.slowDuration);
      // Frost Giant 차별화: 광역 감속 (aoeSlowRadius > 0 시 주변 적도 감속)
      if (tower.def.aoeSlowRadius > 0) {
        const nearby = this.enemySystem.getEnemiesInRange(ex, ey, tower.def.aoeSlowRadius)
          .filter(e => e.id !== enemy.id);
        for (const ne of nearby) {
          this.enemySystem.applySlow(ne.id, tower.def.slowEffect * 0.7, tower.def.slowDuration);
        }
      }
      audio.play('frost_shoot');

    } else if (tid === 'fire_drake') {
      this._spawnFireBolt(tx, ty, ex, ey);
      this.enemySystem.applyBurn(enemy.id, tower.def.burnDps, tower.def.burnDuration);
      this._spawnSplashRing(ex, ey, 20, '#FF6B1A');
      audio.play('fire_shoot');

    } else if (tid === 'tesla') {
      this._spawnLightningBolt(tx, ty, ex, ey);
      audio.play('tesla_zap');
      const chainDmg = Math.round(dmg * tower.def.chainDmgRatio);
      const nearby = this.enemySystem
        .getEnemiesInRange(ex, ey, tower.def.chainRange)
        .filter(e => e.id !== enemy.id)
        .slice(0, tower.def.chainCount + this._chainBonus);
      for (const ct of nearby) {
        this.enemySystem.dealDamage(ct.id, chainDmg);
        this._spawnLightningBolt(ex, ey, ct.x, ct.y);
      }

    } else if (tid === 'druid') {
      this._spawnNatureBolt(tx, ty, ex, ey);
      this.enemySystem.applySlow(enemy.id, tower.def.slowEffect, tower.def.slowDuration);
      audio.play('druid_shoot');

    } else if (tid === 'ballista' || tid === 'marksman') {
      this._spawnArrow(tx, ty, ex, ey, tower.def.accentColor);
      audio.play(tid === 'ballista' ? 'cannon_fire' : 'arrow_shoot');
    } else {
      this._spawnArrow(tx, ty, ex, ey, tower.def.accentColor);
      audio.play('arrow_shoot');
    }

    // ── DLC: shadowDotDps — Shadow DoT 적용 ───────────────
    if (tower.def.shadowDotDps && tower.def.shadowDotDur) {
      this.enemySystem.applyBurn(enemy.id, tower.def.shadowDotDps, tower.def.shadowDotDur);
    }

    this._spawnMuzzleFlash(tx, ty, tower.def.accentColor);
  }

  // ── Druid 오라 계산 ──────────────────────────────────
  // 이 타워 주변에 Druid가 있으면 auraDmgMult 반환 (1 이상)
  _getDruidAuraMult(tower) {
    if (tower.def.id === 'druid') return 1;  // Druid 자신에겐 미적용
    for (const other of this.towers.values()) {
      if (other.def.id !== 'druid') continue;
      const dx = tower.x - other.x;
      const dy = tower.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const auraRangePx = (other.def.auraRange ?? 1.5) * HEX_W * 0.75;
      if (dist <= auraRangePx) {
        const baseMult = other.def.auraDmgMult ?? 0.15;
        return 1 + baseMult + this._druidAuraBonus;
      }
    }
    return 1;
  }

  // ── 화살 (Archer) ────────────────────────────────────
  _spawnArrow(x1, y1, x2, y2, color) {
    const id = `proj-${++this._projId}`;
    const g = svgEl('g', { id, 'pointer-events': 'none' });

    // 화살 몸통
    g.appendChild(svgEl('line', {
      x1: x1.toFixed(1), y1: y1.toFixed(1),
      x2: x2.toFixed(1), y2: y2.toFixed(1),
      stroke: color, 'stroke-width': 2,
      'stroke-linecap': 'round',
      filter: 'url(#glow-filter)',
    }));
    // 화살촉 (목표점 근처 짧은 선 2개)
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const nx = dx/len, ny = dy/len;
    const px = -ny, py = nx; // 수직
    const hx = x2 - nx*8, hy = y2 - ny*8;
    g.appendChild(svgEl('line', {
      x1: x2.toFixed(1), y1: y2.toFixed(1),
      x2: (hx + px*5).toFixed(1), y2: (hy + py*5).toFixed(1),
      stroke: color, 'stroke-width': 1.5, 'stroke-linecap': 'round',
    }));
    g.appendChild(svgEl('line', {
      x1: x2.toFixed(1), y1: y2.toFixed(1),
      x2: (hx - px*5).toFixed(1), y2: (hy - py*5).toFixed(1),
      stroke: color, 'stroke-width': 1.5, 'stroke-linecap': 'round',
    }));

    g.style.animation = 'projFade 0.15s ease-out forwards';
    this.projectileLayer.appendChild(g);
    setTimeout(() => document.getElementById(id)?.remove(), 150);
  }

  // ── 포탄 (Cannon) — transform 기반 이동 ──────────────
  _spawnCannonball(x1, y1, x2, y2) {
    const id = `proj-${++this._projId}`;
    const duration = 200;

    // cx=0, cy=0으로 그리고 transform으로 위치 지정 → CSS transition 가능
    const ball = svgEl('circle', {
      id, cx: 0, cy: 0, r: 6,
      fill: '#e74c3c', stroke: '#ff8c00', 'stroke-width': 1.5,
      filter: 'url(#glow-filter)',
      'pointer-events': 'none',
    });

    ball.style.transform = `translate(${x1.toFixed(1)}px, ${y1.toFixed(1)}px)`;
    ball.style.transition = `transform ${duration}ms linear`;
    this.projectileLayer.appendChild(ball);

    // 다음 프레임에 목표 위치로 이동
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ball.style.transform = `translate(${x2.toFixed(1)}px, ${y2.toFixed(1)}px)`;
      });
    });

    setTimeout(() => document.getElementById(id)?.remove(), duration + 50);
  }

  // ── 얼음 화살 (Frost) ────────────────────────────────
  _spawnIceBolt(x1, y1, x2, y2) {
    const id = `proj-${++this._projId}`;
    const g = svgEl('g', { id, 'pointer-events': 'none' });

    // 얼음 선 (파란 대시)
    g.appendChild(svgEl('line', {
      x1: x1.toFixed(1), y1: y1.toFixed(1),
      x2: x2.toFixed(1), y2: y2.toFixed(1),
      stroke: '#7EC8E3', 'stroke-width': 2.5,
      'stroke-dasharray': '5 3',
      'stroke-linecap': 'round',
      filter: 'url(#glow-filter)',
    }));
    // 충돌 지점 스파크
    g.appendChild(svgEl('circle', {
      cx: x2.toFixed(1), cy: y2.toFixed(1), r: 4,
      fill: '#B0E0FF', opacity: 0.8,
    }));

    g.style.animation = 'projFade 0.2s ease-out forwards';
    this.projectileLayer.appendChild(g);
    setTimeout(() => document.getElementById(id)?.remove(), 200);
  }

  // ── 머즐 플래시 ──────────────────────────────────────
  _spawnMuzzleFlash(x, y, color) {
    const id = `fx-${++this._effectId}`;
    const c = svgEl('circle', {
      id, cx: x.toFixed(1), cy: y.toFixed(1), r: 8,
      fill: color, opacity: 0.6,
      'pointer-events': 'none',
      style: 'transform-origin: ' + x + 'px ' + y + 'px; animation: muzzleFlash 0.15s ease-out forwards',
    });
    this.projectileLayer.appendChild(c);
    setTimeout(() => document.getElementById(id)?.remove(), 150);
  }

  // ── 스플래시 링 (Cannon 폭발) ────────────────────────
  _spawnSplashRing(x, y, radius, color) {
    const id = `fx-${++this._effectId}`;
    const c = svgEl('circle', {
      id, cx: x.toFixed(1), cy: y.toFixed(1), r: radius.toFixed(1),
      fill: color + '22', stroke: color, 'stroke-width': 2,
      'pointer-events': 'none',
      style: 'transform-origin: ' + x + 'px ' + y + 'px; animation: splashRing 0.35s ease-out forwards',
    });
    this.projectileLayer.appendChild(c);
    setTimeout(() => document.getElementById(id)?.remove(), 350);
  }

  // ── 파이어볼 (Fire Drake) ────────────────────────────
  _spawnFireBolt(x1, y1, x2, y2) {
    const id = `proj-${++this._projId}`;
    const duration = 220;
    const ball = svgEl('circle', {
      id, cx: 0, cy: 0, r: 7,
      fill: '#FF6B1A', stroke: '#FFD700', 'stroke-width': 2,
      filter: 'url(#glow-filter)',
      'pointer-events': 'none',
    });
    ball.style.transform = `translate(${x1.toFixed(1)}px, ${y1.toFixed(1)}px)`;
    ball.style.transition = `transform ${duration}ms linear`;
    this.projectileLayer.appendChild(ball);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ball.style.transform = `translate(${x2.toFixed(1)}px, ${y2.toFixed(1)}px)`;
    }));
    setTimeout(() => document.getElementById(id)?.remove(), duration + 50);
  }

  // ── 번개 (Tesla) ─────────────────────────────────────
  _spawnLightningBolt(x1, y1, x2, y2) {
    const id = `proj-${++this._projId}`;
    const g = svgEl('g', { id, 'pointer-events': 'none' });

    // 지그재그 번개: 중간 지점 오프셋
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 24;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 24;
    const pts = `${x1.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;

    g.appendChild(svgEl('polyline', {
      points: pts,
      fill: 'none',
      stroke: '#00CED1', 'stroke-width': 3,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      filter: 'url(#glow-filter)',
    }));
    g.appendChild(svgEl('polyline', {
      points: pts,
      fill: 'none',
      stroke: '#FFFFFF', 'stroke-width': 1,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      opacity: '0.7',
    }));
    // 충돌 스파크
    g.appendChild(svgEl('circle', {
      cx: x2.toFixed(1), cy: y2.toFixed(1), r: 5,
      fill: '#00CED1', opacity: '0.9',
    }));

    g.style.animation = 'projFade 0.12s ease-out forwards';
    this.projectileLayer.appendChild(g);
    setTimeout(() => document.getElementById(id)?.remove(), 120);
  }

  // ── 자연 볼트 (Druid) ────────────────────────────────
  _spawnNatureBolt(x1, y1, x2, y2) {
    const id = `proj-${++this._projId}`;
    const g = svgEl('g', { id, 'pointer-events': 'none' });

    g.appendChild(svgEl('line', {
      x1: x1.toFixed(1), y1: y1.toFixed(1),
      x2: x2.toFixed(1), y2: y2.toFixed(1),
      stroke: '#4CAF50', 'stroke-width': 3,
      'stroke-linecap': 'round',
      'stroke-dasharray': '6 3',
      filter: 'url(#glow-filter)',
    }));
    g.appendChild(svgEl('circle', {
      cx: x2.toFixed(1), cy: y2.toFixed(1), r: 5,
      fill: '#81C784', opacity: '0.85',
    }));

    g.style.animation = 'projFade 0.25s ease-out forwards';
    this.projectileLayer.appendChild(g);
    setTimeout(() => document.getElementById(id)?.remove(), 250);
  }

  getTower(col, row) { return this.towers.get(`${col},${row}`) ?? null; }
  clearAll() { this.towers.clear(); }
}
