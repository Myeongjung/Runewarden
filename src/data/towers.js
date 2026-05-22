// 타워 기본 스탯 정의 — v0.5 (12종 기본 + DLC)
import { SHADOW_TOWER_DEFS } from '../dlc/shadow_realm/towers.js';

const _BASE_TOWER_DEFS = {
  // ── 기존 타워 ─────────────────────────────────────────
  archer: {
    id: 'archer',
    name: 'Archer',
    icon: '🏹',
    color: '#8B5E3C',
    accentColor: '#D4AF37',
    damage: 14,
    range: 4.2,
    attackSpeed: 950,
    splash: 0,
    tags: [],
    shape: 'archer',
  },
  cannon: {
    id: 'cannon',
    name: 'Cannon',
    icon: '💣',
    color: '#555',
    accentColor: '#C0392B',
    damage: 38,
    range: 3.2,
    attackSpeed: 2400,
    splash: 1.4,
    tags: ['Physical'],
    shape: 'cannon',
  },
  frost: {
    id: 'frost',
    name: 'Frost Mage',
    icon: '❄️',
    color: '#2980B9',
    accentColor: '#ECF0F1',
    damage: 9,
    range: 3.8,
    attackSpeed: 1400,
    splash: 0,
    slowEffect: 0.45,
    slowDuration: 2500,
    tags: ['Ice'],
    shape: 'mage',
  },

  // ── 신규 타워 ─────────────────────────────────────────
  fire_drake: {
    id: 'fire_drake',
    name: 'Fire Drake',
    icon: '🐉',
    color: '#8B2200',
    accentColor: '#FF6B1A',
    damage: 22,
    range: 3.5,
    attackSpeed: 1600,
    splash: 0,
    burnDps: 8,          // 번 DoT: 초당 8 피해
    burnDuration: 2500,  // 2.5초 지속
    tags: ['Fire'],
    shape: 'drake',
  },
  tesla: {
    id: 'tesla',
    name: 'Tesla Coil',
    icon: '⚡',
    color: '#1A2A4A',
    accentColor: '#00CED1',
    damage: 16,
    range: 3.0,
    attackSpeed: 700,
    splash: 0,
    chainCount: 2,        // 인접 적 체인 수
    chainDmgRatio: 0.40,  // 체인 피해 배율 (0.55 → 0.40, 밸런스 조정)
    chainRange: 110,      // 체인 사거리(px)
    tags: ['Arcane'],
    shape: 'tesla',
  },
  druid: {
    id: 'druid',
    name: 'Druid Grove',
    icon: '🌿',
    color: '#1A3A1A',
    accentColor: '#4CAF50',
    damage: 12,  // 8 → 12 (버프: 지원 역할이지만 최소 DPS 보장)
    range: 5.0,
    attackSpeed: 1800,
    splash: 0,
    slowEffect: 0.30,
    slowDuration: 3000,
    auraRange: 1.5,
    auraDmgMult: 0.15,
    tags: ['Nature'],
    shape: 'druid',
  },

  // ── 신규 타워 ─────────────────────────────────────────
  glacial: {
    id: 'glacial',
    name: 'Glacial Sentinel',
    icon: '🧊',
    color: '#0A2A4A',
    accentColor: '#00BFFF',
    damage: 12,
    range: 5.5,           // 가장 긴 사거리
    attackSpeed: 1600,
    splash: 0,
    slowEffect: 0.65,     // 매우 강한 감속 (65%)
    slowDuration: 3500,   // 3.5초
    tags: ['Ice'],
    shape: 'mage',        // Frost Mage와 같은 시각 형태
  },
  ballista: {
    id: 'ballista',
    name: 'Ballista',
    icon: '🎯',
    color: '#3D2B1F',
    accentColor: '#C0A080',
    damage: 75,
    range: 5.0,
    attackSpeed: 3500,
    splash: 0,
    tags: ['Physical'],
    shape: 'archer',
  },

  // ── v0.5 신규 타워 ────────────────────────────────────
  frost_giant: {
    id: 'frost_giant',
    name: 'Frost Giant',
    icon: '🌨️',
    color: '#0A1A3A',
    accentColor: '#87CEEB',
    damage: 14,
    range: 6.0,           // 최장 사거리
    attackSpeed: 2200,
    splash: 0,
    slowEffect: 0.60,     // 감속 (Glacial 65%보다 낮지만 범위 적용)
    slowDuration: 3000,
    aoeSlowRadius: 85,    // 차별화: 주변 85px 적에게도 감속 (Glacial과 다른 광역 역할)
    tags: ['Ice'],
    shape: 'mage',
  },
  marksman: {
    id: 'marksman',
    name: 'Marksman',
    icon: '🔦',
    color: '#2A1A0A',
    accentColor: '#FFD700',
    damage: 28,           // Archer(14)의 2배
    range: 7.0,           // 최장 사거리 (Archer 4.2의 1.7배)
    attackSpeed: 1800,
    splash: 0,
    tags: [],
    shape: 'archer',
  },

  // ── v1.2 Shadow Warden 타워 ────────────────────────────
  shadow_strike: {
    id: 'shadow_strike',
    name: 'Shadow Strike',
    icon: '🌑',
    color: '#1A0030',
    accentColor: '#9B59B6',
    damage: 52,           // 매우 높은 단일 피해
    range: 5.5,           // 장거리 (Glacial과 동일)
    attackSpeed: 3200,    // 느린 공속 — 한 방이 강력
    splash: 0,
    tags: ['Shadow'],
    shape: 'archer',
  },
  bone_archer: {
    id: 'bone_archer',
    name: 'Bone Archer',
    icon: '💀',
    color: '#2A1A0A',
    accentColor: '#C8B89A',
    damage: 8,            // 낮은 단일 피해
    range: 3.5,
    attackSpeed: 420,     // 매우 빠른 공속 (Tesla 700보다 빠름)
    splash: 0,
    tags: ['Shadow'],
    shape: 'archer',
  },
};

// DLC 타워 병합
export const TOWER_DEFS = { ..._BASE_TOWER_DEFS, ...SHADOW_TOWER_DEFS };
