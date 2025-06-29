import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // 全域忽略
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },

  // 推薦的基礎設定 (包含 ESLint 核心和 TypeScript 規則)
  ...tseslint.configs.recommended,

  // React 相關套件的專屬設定
  {
    // @eslint-react 是新的、官方推薦的 React 外掛。
    // 它取代了舊的 eslint-plugin-react 和 eslint-plugin-react-hooks。
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    ...eslintReact.configs.recommended,
  },

  // Node.js (API) 專屬設定
  {
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // 您可以在此處添加任何 Node.js 特有的規則
    },
  },

  // 全域規則覆寫
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Prettier 設定，必須放在最後以覆蓋其他樣式規則
  prettier
);
