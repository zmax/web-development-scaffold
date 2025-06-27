# 網頁骨架

這是一個 Monorepo 網頁骨架專案，旨在為構建現代網頁應用程式提供一個穩健且可擴展的基礎。它利用 `pnpm` 進行高效的套件管理，並包含一個 `web` 應用程式、共享的 `ui` 元件、`types` 和 `utils` 套件。

## 功能

*   **Monorepo 結構：** 使用 `pnpm` 工作區進行組織，以高效管理多個套件。
*   **React.js：** 一個用於構建使用者介面的宣告式、基於元件的 JavaScript 函式庫。
*   **Vite：** 一個快速且有主見的現代網頁專案建構工具，提供即時伺服器啟動和閃電般的 HMR。
*   **TypeScript：** 提供靜態型別檢查，以提高程式碼品質和開發者體驗。
*   **Tailwind CSS：** 一個實用程式優先的 CSS 框架，用於快速構建自訂設計。
*   **ESLint & Prettier：** 用於一致的程式碼風格和品質。
*   **Vitest：** 一個由 Vite 驅動的快速單元測試框架。
*   **Husky & Commitlint：** 用於 Git 鉤子和常規提交訊息。

## 專案結構

```
.
├── apps/
│   └── web/             # 主要網頁應用程式
├── packages/
│   ├── types/           # ��享的 TypeScript 型別定義
│   ├── ui/              # 可重用的 UI 元件 (例如：Button)
│   └── utils/           # 通用工具函式 (例如：cn, formatDate)
├── .husky/              # Git 鉤子
├── .vscode/             # VS Code 設定
├── eslint.config.js     # ESLint 設定
├── prettier.config.js   # Prettier 設定
├── tailwind.config.js   # Tailwind CSS 設定
├── tsconfig.json        # TypeScript 設定
└── pnpm-workspace.yaml  # pnpm 工作區定義
```

## 開始使用

### 先決條件

*   [Node.js](https://nodejs.org/) (建議 LTS 版本)
*   [pnpm](https://pnpm.io/installation)

### 安裝

1.  **複製儲存庫：**
    ```bash
    git clone <你的儲存庫網址>
    cd my-web-scaffold
    ```

2.  **安裝依賴項：**
    ```bash
    pnpm install
    ```

### 開發

啟動網頁應用程式的開發伺服器：

```bash
pnpm dev
```

這通常會在 `http://localhost:5173` 啟動網頁應用程式。

### 建構

建構所有套件和網頁應用程式以供生產：

```bash
pnpm build
```

### 測試

執行所有測試：

```bash
pnpm test
```

以監聽模式執行測試：

```bash
pnpm test:watch
```

### Linting 和格式化

對程式碼庫進行 Linting：

```bash
pnpm lint
```

修復 Linting 問題：

```bash
pnpm lint:fix
```

使用 Prettier 格式化程式碼：

```bash
pnpm format
```

檢查格式而不應用更改：

```bash
pnpm format:check
```

### 型別檢查

對所有 TypeScript 檔案執行型別檢查：

```bash
pnpm type-check
```

### 清理

清理建構產物和 `dist` 目錄：

```bash
pnpm clean
```

## 貢獻

請遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 規範來編寫提交訊息。此專案使用 `commitizen` 進行引導式提交。

進行提交：

```bash
pnpm commit
```