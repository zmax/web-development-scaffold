/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // 使用 tsconfigPaths 外掛程式來自動讀取 tsconfig.json 中的路徑別名
  // 這比手動設定 alias 更可靠且易於維護
  plugins: [react(), tsconfigPaths()],
  build: {
    // 明確指定輸出目錄，雖然 'dist' 是預設值，但這樣可以讓設定更清晰
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
