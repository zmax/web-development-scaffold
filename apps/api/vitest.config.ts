import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // 建議改為 false，並在測試檔案中明確匯入，以獲得更好的靜態分析與一致性
    globals: false,
    environment: 'node',
    setupFiles: './src/test/setup.ts', // 設定檔，用於 mock
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/services/**/*.ts', 'src/utils/**/*.ts'],
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
