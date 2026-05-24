/**
 * Runewarden — 공유 상수
 *
 * 여러 시스템(GameEngine, TowerSystem, EnemySystem, MapRenderer)에서
 * 공통으로 사용하는 수치를 한 곳에 관리합니다.
 */

// ── 헥스 그리드 기하 ─────────────────────────────────
export const HEX_SIZE = 34;                       // flat-top 헥사곤 반지름 (px)
export const HEX_W    = HEX_SIZE * 2;             // 헥스 전체 너비 = 68px
export const HEX_H    = Math.sqrt(3) * HEX_SIZE;  // 헥스 전체 높이 ≈ 58.8px

// ── 게임 구조 ─────────────────────────────────────────
export const ACT_SIZE = 5;  // 액트당 웨이브 수
