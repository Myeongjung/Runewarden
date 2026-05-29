import { describe, it, expect } from 'vitest';
import {
  getLevelFromXp,
  getWaveXpGrant,
  weightedPickRarity,
  XP_THRESHOLDS,
  MAX_PLAYER_LEVEL,
} from '../src/systems/PlayerLevelSystem.js';

describe('PlayerLevelSystem', () => {

  describe('T1: getLevelFromXp — 기본 경계값', () => {
    it('XP 0 → Lv1', () => expect(getLevelFromXp(0)).toBe(1));
    it('XP 9 → Lv1 (임계값 미달)', () => expect(getLevelFromXp(9)).toBe(1));
    it('XP 10 → Lv2 (임계값 정확)', () => expect(getLevelFromXp(10)).toBe(2));
  });

  describe('T2: getLevelFromXp — 중간·최대', () => {
    it('XP 65 → Lv5', () => expect(getLevelFromXp(65)).toBe(5));
    it('XP 165 → Lv8', () => expect(getLevelFromXp(165)).toBe(8));
    it('XP 999 → Lv8 (상한 클램프)', () => expect(getLevelFromXp(999)).toBe(MAX_PLAYER_LEVEL));
  });

  describe('T3: getWaveXpGrant — 공식 검증', () => {
    it('Wave 1 → 3 XP', () => expect(getWaveXpGrant(1)).toBe(3));
    it('Wave 3 → 4 XP', () => expect(getWaveXpGrant(3)).toBe(4));
    it('Wave 15 → 8 XP', () => expect(getWaveXpGrant(15)).toBe(8));
  });

  describe('T4: Wave 1~15 XP 합산', () => {
    it('15웨이브 합산 === 80', () => {
      let total = 0;
      for (let w = 1; w <= 15; w++) total += getWaveXpGrant(w);
      expect(total).toBe(80);
    });
  });

  describe('T5: weightedPickRarity — 통계 검증', () => {
    it('Lv1: 1000회 중 rare ≈ 2% (0~5%)', () => {
      let rare = 0;
      for (let i = 0; i < 1000; i++) if (weightedPickRarity(1) === 'rare') rare++;
      expect(rare).toBeGreaterThanOrEqual(0);
      expect(rare).toBeLessThanOrEqual(50); // 5% 상한
    });

    it('Lv8: 1000회 중 rare ≈ 32% (25~40%)', () => {
      let rare = 0;
      for (let i = 0; i < 1000; i++) if (weightedPickRarity(8) === 'rare') rare++;
      expect(rare).toBeGreaterThanOrEqual(250); // 25% 하한
      expect(rare).toBeLessThanOrEqual(400); // 40% 상한
    });
  });

  describe('T6: v3 세이브 마이그레이션 (playerLevel 기본값)', () => {
    it('save.playerLevel ?? 1 → 1 (v3 세이브)', () => {
      const save = { v: 3, wave: 5 }; // playerLevel 없음
      const level = Math.min(MAX_PLAYER_LEVEL, Math.max(1, save.playerLevel ?? 1));
      expect(level).toBe(1);
    });
  });

  describe('T7: XP 누적으로 레벨업', () => {
    it('XP 9에서 Wave 3(+4XP) 후 Lv2 도달', () => {
      let xp = 9;
      xp += getWaveXpGrant(3); // +4 → 13
      expect(getLevelFromXp(xp)).toBe(2);
    });
  });

  describe('T8: Lv8 MAX에서 추가 XP', () => {
    it('getLevelFromXp(500) === 8 (MAX 클램프)', () => {
      expect(getLevelFromXp(500)).toBe(MAX_PLAYER_LEVEL);
    });
  });
});
