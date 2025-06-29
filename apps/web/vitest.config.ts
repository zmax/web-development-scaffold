import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    // Only run linter in development
    mode !== 'test' &&
      linterPlugin({
        include: ['./src/**/*.{ts,tsx}'],
        linters: [
          new EsLinter({
            configEnv: {
              mode: 'development',
              command: 'serve',
              ssrBuild: false,
            },
          }),
        ],
      }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
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
}));
