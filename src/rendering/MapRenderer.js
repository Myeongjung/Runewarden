// SVG 헥스 그리드 렌더러 — flat-top 헥사곤 사용
// 헥스 좌표계: offset(col, row), 픽셀 변환 포함

import { HEX_SIZE, HEX_W, HEX_H } from '../config/constants.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// 맵 크기
export const COLS = 14;
export const ROWS = 9;

// ── 활성 맵 (런 시작 시 setActiveMap()으로 변경) ──────
// 기본값: Crossroads (원래 경로)
let _activePathData = [
  [0,4],[1,4],[2,4],[2,3],[3,3],[4,3],[4,4],[5,4],[5,5],[6,5],[6,4],[7,4],[8,4],[8,3],[9,3],[10,3],[10,4],[11,4],[11,5],[12,5],[13,5]
];
let _pathSet         = new Set(_activePathData.map(([c,r]) => `${c},${r}`));
let _pathAdjacentSet = _buildAdjacent(_pathSet);
let _mapHexColor     = null;   // 맵 테마 헥스 배경색 (null = 기본)
let _mapPathColor    = null;   // 맵 테마 경로색 (null = 기본)

function _buildAdjacent(pathSet) {
  const OFFSETS = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1]];
  const adj = new Set();
  for (const key of pathSet) {
    const [c, r] = key.split(',').map(Number);
    for (const [dc, dr] of OFFSETS) {
      const nc = c + dc, nr = r + dr;
      const nk = `${nc},${nr}`;
      if (!pathSet.has(nk) && nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) adj.add(nk);
    }
  }
  return adj;
}

/** 런 시작 시 맵 변경 — MapRenderer 생성 전에 호출 */
export function setActiveMap(pathArray, mapDef = null) {
  _activePathData  = pathArray;
  _pathSet         = new Set(pathArray.map(([c,r]) => `${c},${r}`));
  _pathAdjacentSet = _buildAdjacent(_pathSet);
  _mapHexColor     = mapDef?.hexColor  ?? null;
  _mapPathColor    = mapDef?.pathColor ?? null;
}

/** 현재 활성 경로 반환 (EnemySystem의 웨이포인트 계산용) */
export const ENEMY_PATH = { get current() { return _activePathData; } };

export function isPathAdjacent(col, row) { return _pathAdjacentSet.has(`${col},${row}`); }
export function isPathCell(col, row)     { return _pathSet.has(`${col},${row}`); }
export function isPlaceableCell(col, row) {
  if (isPathCell(col, row)) return false;
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  return true;
}

// ── 좌표 변환 ──────────────────────────────────────────
export function hexToPixel(col, row) {
  // flat-top offset: 짝수 열은 아래로 shift
  const x = col * HEX_W * 0.75 + HEX_SIZE;
  const y = row * HEX_H + (col % 2 === 0 ? HEX_H / 2 : 0) + HEX_H / 2;
  return { x, y };
}

// Pre-computed offsets for flat-top hexagon corners (angles 0°, 60°, 120°, 180°, 240°, 300°)
const _HEX_CORNERS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 180) * (60 * i);
  return [HEX_SIZE * Math.cos(a), HEX_SIZE * Math.sin(a)];
});

function hexCorners(cx, cy) {
  return _HEX_CORNERS.map(([dx, dy]) => `${(cx + dx).toFixed(2)},${(cy + dy).toFixed(2)}`).join(' ');
}

// ── SVG 유틸 ──────────────────────────────────────────
export function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// ── MapRenderer 클래스 ─────────────────────────────────
export class MapRenderer {
  constructor(svgEl, onCellClick, onCellHover) {
    this.svg = svgEl;
    this.onCellClick = onCellClick;
    this.onCellHover = onCellHover ?? (() => {});
    this.cellMap = new Map();   // "col,row" → <g> 요소
    this.towerLayer = null;
    this.enemyLayer = null;
    this.projectileLayer = null;
    this._selectedCell = null;
    this._init();
  }

  // SVG stop 요소 생성 헬퍼 (offset/stop-color는 attribute로만 설정 가능)
  _mkStop(offset, color) {
    const s = svgEl('stop');
    s.setAttribute('offset', offset);
    s.setAttribute('stop-color', color);
    return s;
  }

  _init() {
    // SVG defs — 헥스 깊이감용 radialGradient 정의
    const defs = svgEl('defs');
    // 기본 헥스 그라디언트 (중앙 약간 밝음) — 맵 테마 반영
    const hexBase   = _mapHexColor ?? '#222240';
    const hexOuter  = _mapHexColor ?? '#141428';
    const rg = svgEl('radialGradient', { id: 'hexGrad', cx: '50%', cy: '40%', r: '60%' });
    rg.appendChild(this._mkStop('0%',   hexBase));
    rg.appendChild(this._mkStop('100%', hexOuter));
    // 경로 인접 셀 그라디언트 (초록 서브톤 — 테마 비의존)
    const rg2 = svgEl('radialGradient', { id: 'hexGradAdj', cx: '50%', cy: '40%', r: '60%' });
    rg2.appendChild(this._mkStop('0%', '#1e2e1e'));
    rg2.appendChild(this._mkStop('100%', '#10180f'));
    defs.appendChild(rg); defs.appendChild(rg2);
    this.svg.appendChild(defs);

    // 배경
    const bg = svgEl('rect', { x: 0, y: 0, width: '100%', height: '100%', fill: '#0f0f22' });
    this.svg.appendChild(bg);

    // 레이어 그룹 (그리기 순서 = z-order)
    const gridLayer = svgEl('g', { id: 'grid-layer' });
    const pathLayer = svgEl('g', { id: 'path-layer' });   // 헥스 위, 타워 아래
    this.towerLayer = svgEl('g', { id: 'tower-layer' });
    this.enemyLayer = svgEl('g', { id: 'enemy-layer' });
    this.projectileLayer = svgEl('g', { id: 'projectile-layer' });
    this.svg.appendChild(gridLayer);
    this.svg.appendChild(pathLayer);
    this.svg.appendChild(this.towerLayer);
    this.svg.appendChild(this.enemyLayer);
    this.svg.appendChild(this.projectileLayer);

    // 헥스 셀 먼저 그리기
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        this._drawCell(gridLayer, c, r);
      }
    }

    // 경로 오버레이 (헥스 위에 그림)
    this._drawPathLine(pathLayer);

    // SVG viewBox 설정
    const totalW = COLS * HEX_W * 0.75 + HEX_SIZE * 1.25;
    const totalH = ROWS * HEX_H + HEX_H;
    this.svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }

  _drawPathLine(layer) {
    const path = ENEMY_PATH.current;  // 현재 활성 맵 경로 (getter)

    // 맵 테마 경로색 결정
    const pathColor    = _mapPathColor ?? 'rgba(220,70,70,0.4)';
    const pathFill     = pathColor.replace(/[\d.]+\)$/, s => String(parseFloat(s) * 0.45) + ')');
    const pathStroke   = pathColor;
    const lineColor    = pathColor.replace(/[\d.]+\)$/, s => String(Math.min(1, parseFloat(s) + 0.1)) + ')');

    // 1) 경로 헥스마다 반투명 오버레이 — 헥스 위에 그려지므로 선명하게 보임
    for (const [c, r] of path) {
      const { x, y } = hexToPixel(c, r);
      layer.appendChild(svgEl('polygon', {
        points: hexCorners(x, y),
        fill: pathFill,
        stroke: pathStroke,
        'stroke-width': 1,
        'pointer-events': 'none',
      }));
    }

    // 2) 경로 중심선
    const pts = path.map(([c, r]) => {
      const { x, y } = hexToPixel(c, r);
      return `${x},${y}`;
    }).join(' ');
    layer.appendChild(svgEl('polyline', {
      points: pts, fill: 'none',
      stroke: lineColor,
      'stroke-width': 2.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      'stroke-dasharray': '7 5',
      'pointer-events': 'none',
    }));

    // 3) 방향 화살표
    for (let i = 2; i < path.length; i += 3) {
      const [c1, r1] = path[i - 1];
      const [c2, r2] = path[i];
      const p1 = hexToPixel(c1, r1);
      const p2 = hexToPixel(c2, r2);
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      const arr = svgEl('text', {
        x: mx, y: my,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: 'rgba(255,150,150,0.75)', 'font-size': '10px',
        transform: `rotate(${angle},${mx},${my})`,
        'pointer-events': 'none',
      });
      arr.textContent = '▶';
      layer.appendChild(arr);
    }

    // 4) 시작 마커
    const [sc, sr] = path[0];
    const sp = hexToPixel(sc, sr);
    // 외부 글로우 링 (CSS 애니메이션)
    layer.appendChild(svgEl('circle', {
      cx: sp.x, cy: sp.y, r: 18,
      fill: 'none', stroke: '#e74c3c', 'stroke-width': 1.5, opacity: '0.3',
      class: 'spawn-marker', 'pointer-events': 'none',
    }));
    layer.appendChild(svgEl('circle', {
      cx: sp.x, cy: sp.y, r: 14,
      fill: 'rgba(231,76,60,0.35)', stroke: '#e74c3c', 'stroke-width': 2,
      'pointer-events': 'none',
    }));
    layer.appendChild(this._label(sp.x, sp.y, 'SPAWN', '#ff8888', '8px'));

    // 5) 종료 마커
    const [ec, er] = path[path.length - 1];
    const ep = hexToPixel(ec, er);
    layer.appendChild(svgEl('circle', {
      cx: ep.x, cy: ep.y, r: 18,
      fill: 'none', stroke: '#8E44AD', 'stroke-width': 1.5, opacity: '0.3',
      class: 'exit-marker', 'pointer-events': 'none',
    }));
    layer.appendChild(svgEl('circle', {
      cx: ep.x, cy: ep.y, r: 14,
      fill: 'rgba(142,68,173,0.35)', stroke: '#8E44AD', 'stroke-width': 2,
      'pointer-events': 'none',
    }));
    layer.appendChild(this._label(ep.x, ep.y, 'EXIT', '#bb88ff', '8px'));
  }

  _label(x, y, text, fill, size = '11px') {
    const t = svgEl('text', {
      x, y,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill,
      'font-size': size,
      'pointer-events': 'none',
    });
    t.textContent = text;
    return t;
  }

  _drawCell(layer, col, row) {
    const { x, y } = hexToPixel(col, row);
    const isPath = isPathCell(col, row);

    const g = svgEl('g', { class: `hex-cell${isPath ? ' path-cell' : ' placeable'}` });

    const isAdj = !isPath && isPathAdjacent(col, row);
    // 맵 테마 헥스 배경색 적용
    const themeHex = _mapHexColor;
    const poly = svgEl('polygon', {
      class: 'hex-bg',
      points: hexCorners(x, y),
      fill: isPath ? (themeHex ?? '#1f1520') : isAdj ? 'url(#hexGradAdj)' : 'url(#hexGrad)',
      stroke: isPath ? '#3a2030' : isAdj ? '#1e3a1e' : '#232340',
      'stroke-width': 1,
    });
    g.appendChild(poly);

    if (!isPath) {
      // 경로 인접 셀: 초록 점으로 배치 추천 표시
      const dotColor = isAdj ? '#2e6b2e' : '#2a2a50';
      const dotR     = isAdj ? 3 : 2;
      const dot = svgEl('circle', { cx: x, cy: y, r: dotR, fill: dotColor, 'pointer-events': 'none' });
      g.appendChild(dot);

      // 인접 셀: 추가 하이라이트 링
      if (isAdj) {
        const ring = svgEl('polygon', {
          points: hexCorners(x, y),
          fill: 'none',
          stroke: 'rgba(46,107,46,0.25)',
          'stroke-width': 1.5,
          'pointer-events': 'none',
        });
        g.appendChild(ring);
      }

      const baseFill    = isAdj ? '#182218' : '#16162e';
      const hoverFill   = isAdj ? '#1e3a1e' : '#1e2248';

      g.addEventListener('click', () => this.onCellClick(col, row, g));
      g.addEventListener('mouseenter', () => {
        if (!g.dataset.tower) poly.setAttribute('fill', hoverFill);
        this.onCellHover(col, row, true);
      });
      g.addEventListener('mouseleave', () => {
        if (!g.dataset.tower) poly.setAttribute('fill', baseFill);
        this.onCellHover(col, row, false);
      });
    }

    layer.appendChild(g);
    this.cellMap.set(`${col},${row}`, g);
  }

  // ── 타워 배치 ─────────────────────────────────────────
  placeTower(col, row, towerDef) {
    const { x, y } = hexToPixel(col, row);
    const key = `${col},${row}`;
    const cell = this.cellMap.get(key);
    if (!cell) return;

    // 셀 배경 색 변경
    cell.querySelector('.hex-bg').setAttribute('fill', towerDef.color + '33');
    cell.querySelector('.hex-bg').setAttribute('stroke', towerDef.color);
    cell.dataset.tower = towerDef.id;

    // 타워 SVG 그리기
    const tg = svgEl('g', { id: `tower-${col}-${row}`, class: 'tower-group', 'pointer-events': 'none' });
    tg.appendChild(this._drawTowerShape(x, y, towerDef));

    // 아이콘 텍스트
    tg.appendChild(this._label(x, y, towerDef.icon, '#fff', '18px'));

    // 팝 애니메이션
    tg.style.transformOrigin = `${x}px ${y}px`;
    tg.style.animation = 'towerPop 0.3s ease-out';
    this.towerLayer.appendChild(tg);

    // CSS 키프레임 (한 번만 추가)
    if (!document.getElementById('tower-pop-style')) {
      const s = document.createElement('style');
      s.id = 'tower-pop-style';
      s.textContent = `@keyframes towerPop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }`;
      document.head.appendChild(s);
    }

    return tg;
  }

  // 다각형 점 생성 헬퍼 (cx, cy 중심, r 반지름, n 변 수, rot 회전 라디안)
  _polyPts(cx, cy, r, n, rot = 0) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI / n) + rot;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // 별 모양 점 생성 헬퍼 (n 꼭지, outer/inner 반지름, rot 회전)
  _starPts(cx, cy, outer, inner, n, rot = 0) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI / n) + rot;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  _drawTowerShape(x, y, def) {
    const g   = svgEl('g');
    const r   = HEX_SIZE * 0.50;  // 기본 반지름 ~17px
    const id  = def.id;
    const col = def.color;
    const acc = def.accentColor;
    const sw  = 2;

    // ── 형태 분기 ──────────────────────────────────────
    if (id === 'archer' || id === 'marksman' || id === 'bone_archer') {
      // 다이아몬드 (회전된 정사각형) — 빠른 단일 공격 계열
      g.appendChild(svgEl('polygon', {
        points: this._polyPts(x, y, r, 4, -Math.PI / 4),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));

    } else if (id === 'cannon' || id === 'ballista') {
      // 육각형 — 묵직한 포격 계열
      g.appendChild(svgEl('polygon', {
        points: this._polyPts(x, y, r, 6, -Math.PI / 6),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
      // 포구 돌출 (작은 직사각형)
      g.appendChild(svgEl('rect', {
        x: x - 3, y: y - r - 5, width: 6, height: 7,
        fill: acc, rx: 1,
      }));

    } else if (id === 'frost' || id === 'glacial' || id === 'frost_giant') {
      // 팔각형 — 얼음 결정 실루엣
      g.appendChild(svgEl('polygon', {
        points: this._polyPts(x, y, r, 8, Math.PI / 8),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
      // 내부 십자 (얼음 결정 문양)
      g.appendChild(svgEl('line', { x1: x, y1: y - r * 0.55, x2: x, y2: y + r * 0.55,
        stroke: acc, 'stroke-width': 1.2, opacity: '0.7' }));
      g.appendChild(svgEl('line', { x1: x - r * 0.55, y1: y, x2: x + r * 0.55, y2: y,
        stroke: acc, 'stroke-width': 1.2, opacity: '0.7' }));

    } else if (id === 'fire_drake') {
      // 5각별 — 불꽃 실루엣
      g.appendChild(svgEl('polygon', {
        points: this._starPts(x, y, r, r * 0.45, 5, -Math.PI / 2),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));

    } else if (id === 'tesla') {
      // 오각형 (전기 코일 느낌) + 아크 2개
      g.appendChild(svgEl('polygon', {
        points: this._polyPts(x, y, r, 5, -Math.PI / 2),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
      // 작은 전기 아크 장식
      g.appendChild(svgEl('circle', { cx: x - r * 0.35, cy: y - r * 0.2, r: 2.5,
        fill: acc, opacity: '0.8' }));
      g.appendChild(svgEl('circle', { cx: x + r * 0.35, cy: y - r * 0.2, r: 2.5,
        fill: acc, opacity: '0.8' }));

    } else if (id === 'druid') {
      // 원 + 3개 잎사귀 (자연 문양)
      g.appendChild(svgEl('circle', {
        cx: x, cy: y, r: r * 0.85,
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * Math.PI / 3) - Math.PI / 2;
        const lx = x + r * 0.85 * Math.cos(a);
        const ly = y + r * 0.85 * Math.sin(a);
        g.appendChild(svgEl('circle', { cx: lx.toFixed(1), cy: ly.toFixed(1), r: r * 0.28,
          fill: acc, opacity: '0.85' }));
      }

    } else if (id === 'shadow_strike') {
      // 역삼각형 (그림자 단검 느낌)
      g.appendChild(svgEl('polygon', {
        points: this._polyPts(x, y, r, 3, Math.PI / 2),
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
      // 날카로운 내부 라인
      g.appendChild(svgEl('line', { x1: x, y1: y - r * 0.3, x2: x, y2: y + r * 0.7,
        stroke: acc, 'stroke-width': 1.5, opacity: '0.7' }));

    } else {
      // 기본 폴백: 원형
      g.appendChild(svgEl('circle', {
        cx: x, cy: y, r,
        fill: col, stroke: acc, 'stroke-width': sw,
      }));
    }

    // 중앙 이모지 아이콘 (공통)
    const icon = svgEl('text', {
      x, y,
      'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-size': `${HEX_SIZE * 0.55}px`,
      'pointer-events': 'none',
    });
    icon.textContent = def.icon;
    g.appendChild(icon);

    return g;
  }

  // 사격 반동 애니메이션 — 타워가 잠깐 커졌다 돌아오는 효과
  kickTower(col, row) {
    const tg = document.getElementById(`tower-${col}-${row}`);
    if (!tg) return;
    const { x, y } = hexToPixel(col, row);
    tg.style.transformOrigin = `${x}px ${y}px`;
    tg.style.animation = 'none';
    void tg.offsetWidth;
    tg.style.animation = 'towerKick 0.14s ease-out';
    setTimeout(() => { if (tg) tg.style.animation = ''; }, 150);
  }

  removeTower(col, row) {
    const tg = document.getElementById(`tower-${col}-${row}`);
    if (tg) tg.remove();
    const key = `${col},${row}`;
    const cell = this.cellMap.get(key);
    if (cell) {
      cell.querySelector('.hex-bg').setAttribute('fill', '#16162e');
      cell.querySelector('.hex-bg').setAttribute('stroke', '#2a2a45');
      delete cell.dataset.tower;
    }
  }

  // 타워에 강화 시각 표시 (augCount: 1 또는 2)
  markAugmented(col, row, towerDef, augCount = 1) {
    const tg = document.getElementById(`tower-${col}-${row}`);
    if (!tg) return;

    // 기존 강화 표시 제거 후 재렌더
    tg.querySelectorAll('.aug-indicator').forEach(el => el.remove());

    const { x, y } = hexToPixel(col, row);
    const count = Math.min(augCount, 2);

    for (let i = 0; i < count; i++) {
      // 1강화: 중앙 위, 2강화: 좌/우 두 점
      const offsetX = count === 1 ? 0 : (i === 0 ? -5 : 5);
      const offsetY = -HEX_SIZE * 0.54;
      const dot = svgEl('circle', {
        cx: x + offsetX,
        cy: y + offsetY,
        r: 4,
        fill: '#D4AF37',
        stroke: '#1A1A2E',
        'stroke-width': 1,
        class: 'aug-indicator',
      });
      tg.appendChild(dot);
    }
  }

  // ── 범위 표시 (rangePx: 픽셀 단위 or rangeHex: 헥스 단위) ──
  showRange(col, row, rangePx) {
    this.hideRange();
    const { x, y } = hexToPixel(col, row);
    const g = svgEl('g', { id: 'range-indicator', 'pointer-events': 'none' });
    // 채움 원
    g.appendChild(svgEl('circle', {
      cx: x, cy: y, r: rangePx,
      fill: 'rgba(212,175,55,0.07)',
    }));
    // 테두리 실선
    g.appendChild(svgEl('circle', {
      cx: x, cy: y, r: rangePx,
      fill: 'none',
      stroke: 'rgba(212,175,55,0.55)',
      'stroke-width': 1.5,
      'stroke-dasharray': '6 4',
    }));
    this.svg.insertBefore(g, this.towerLayer);
  }

  hideRange() {
    document.getElementById('range-indicator')?.remove();
  }

  // ── 셀 선택 하이라이트 ────────────────────────────────
  selectCell(col, row) {
    this.clearSelection();
    const cell = this.cellMap.get(`${col},${row}`);
    if (cell) {
      cell.classList.add('selected-cell');
      this._selectedCell = `${col},${row}`;
    }
  }

  clearSelection() {
    if (this._selectedCell) {
      this.cellMap.get(this._selectedCell)?.classList.remove('selected-cell');
      this._selectedCell = null;
    }
    this.hideRange();
  }

  // ── 적 레이어 접근자 ──────────────────────────────────
  getEnemyLayer()      { return this.enemyLayer; }
  getProjectileLayer() { return this.projectileLayer; }
}
