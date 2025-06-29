import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 建議改為 false，與其他工作區保持一致，並在測試檔案中明確匯入
    globals: false,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts'],
    },
  },
});
