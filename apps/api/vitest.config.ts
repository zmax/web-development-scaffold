import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // 使用 vite-tsconfig-paths 插件。
  // 這個插件會自動讀取 `tsconfig.json` 中的 `compilerOptions.paths` 設定，
  // 讓我們可以在測試中直接使用像 `@/*` 這樣的路徑別名，
  // 無需在此檔案中重複設定。這完全符合 gemini.md 的規範。
  plugins: [tsconfigPaths()],
  test: {
    // 建議改為 false，並在測試檔案中明確匯入，以獲得更好的靜態分析與一致性
    globals: false,
    environment: 'node',
    setupFiles: './src/test/setup.ts', // 設定檔，用於 mock
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 包含 src 目錄下的所有 .ts 檔案
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/test/**',
        'src/types/**',
        'src/lib/**',
        'src/middleware/**',
        '**/*.controller.ts', // 控制器通常透過整合測試來覆蓋
      ],
    },
  },
});
