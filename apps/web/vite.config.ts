/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // 調整外掛程式順序：
  // 確保 `tsconfigPaths` 在 `react` 之前執行，
  // 這樣可以保證路徑別名在被其他外掛程式處理之前就被正確解析。
  plugins: [tsconfigPaths(), react()],
  build: {
    // 明確指定輸出目錄，雖然 'dist' 是預設值，但這樣可以讓設定更清晰
    outDir: 'dist',
  },
  test: {
    // 遵循專案準則，設定為 false 以鼓勵明確匯入。
    // 這能提升程式碼的可讀性和靜態分析能力，並與其他工作區的設定保持一致。
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 包含 src 目錄下的所有 .ts 和 .tsx 檔案
      include: ['src/**/*.{ts,tsx}'],
      // 排除不需計算覆蓋率的檔案
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/lib/api.ts', // API 客戶端通常由整合測試覆蓋
      ],
    },
  },
});
