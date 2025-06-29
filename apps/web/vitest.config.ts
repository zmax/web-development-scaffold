import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // 建議改為 false，並在測試檔案中明確匯入，以獲得更好的靜態分析
    globals: false,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // 如果您的元件有匯入 CSS 檔案，請啟用此選項
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        '**/*.test.{ts,tsx}',
      ],
    },
  },
});
