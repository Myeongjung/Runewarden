import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',   // Electron DOM 없이 순수 로직 테스트
    include: ['tests/**/*.test.js'],
  },
});
