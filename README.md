# Web Development Scaffold

這是一個基於 **pnpm workspace** 的 **Monorepo**，旨在提供一個現代化、可擴展的網頁應用程式開發骨架。它整合了業界最佳實踐，包含獨立的前端應用、可共享的 UI 元件、工具函式庫和型別定義。

## ✨ 核心目標

- **程式碼共享與重用**：透過 `packages` 目錄，在不同應用之間共享 UI 元件、工具函式和型別定義。
- **開發效率**：利用 Vite 提供快速的開發伺服器和建構流程。
- **程式碼品質**：整合 ESLint, Prettier, TypeScript 和自動化的 Git 鉤子，確保程式碼風格一致且型別安全。
- **結構化與可維護性**：清晰的目錄結構和模組化設計，便於團隊協作和長期維護。

## 🛠️ 技術棧

| 分類            | 技術                                  | 用途                                                     |
| :-------------- | :------------------------------------ | :------------------------------------------------------- |
| **主要框架**    | React 18                              | 建立使用者介面的核心函式庫。                             |
| **建構工具**    | Vite                                  | 提供極速的開發伺服器和優化的生產環境建構。               |
| **語言**        | TypeScript                            | 為專案提供靜態型別檢查，提升程式碼健壯性。               |
| **樣式**        | Tailwind CSS                          | 一個 Utility-First 的 CSS 框架，用於快速設計 UI。        |
| **套件管理**    | pnpm                                  | 高效能的套件管理器，並透過 workspace 功能支援 Monorepo。 |
| **測試**        | Vitest, React Testing Library         | 用於單元測試和元件測試，確保程式碼品質。                 |
| **程式碼規範**  | ESLint, Prettier                      | 強制程式碼風格和語法規範。                               |
| **Commit 規範** | Commitlint, cz-conventional-changelog | 確保 Git 提交訊息的一致性和可讀性。                      |
| **Git 鉤子**    | Husky                                 | 在 Git 事件（如 commit, push）觸發時自動執行腳本。       |

## 📂 專案結構

```
.
├── apps/
│   └── web/             # 主要網頁應用程式
├── packages/
│   ├── types/           # 共享的 TypeScript 型別定義 (e.g., User)
│   ├── ui/              # 可重用的 UI 元件 (e.g., Button, Card)
│   └── utils/           # 通用工具函式 (e.g., cn, formatDate)
├── .husky/              # Git 鉤子設定
├── scripts/             # 自動化腳本 (e.g., generate-commit-message.mjs)
├── .commitlintrc.js     # Commitlint 設定
├── eslint.config.js     # ESLint 設定
├── prettier.config.js   # Prettier 設定
├── tailwind.config.js   # 根 Tailwind CSS 設定
└── tsconfig.json        # 根 TypeScript 設定
```

## 🚀 開始使用

### 先決條件

- [Node.js](https://nodejs.org/) (建議 LTS 版本)
- [pnpm](https://pnpm.io/installation)

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

啟動 `apps/web` 的開發伺服器：

```bash
pnpm dev
```

伺服器將會運行在 `http://localhost:5173`。

## 📜 可用腳本

| 指令              | 描述                                   |
| :---------------- | :------------------------------------- |
| `pnpm dev`        | 啟動開發伺服器。                       |
| `pnpm build`      | 建構所有套件和應用程式以供生產。       |
| `pnpm test`       | 執行所有測試。                         |
| `pnpm test:watch` | 以監聽模式執行測試。                   |
| `pnpm lint`       | 檢查整個專案的程式碼風格。             |
| `pnpm format`     | 自動格式化所有檔案。                   |
| `pnpm type-check` | 執行 TypeScript 的型別檢查。           |
| `pnpm clean`      | 清理所有 `dist` 目錄。                 |
| `pnpm commit`     | 使用 Commitizen 引導式地產生提交訊息。 |

## 🤝 貢獻

歡迎所有貢獻！請在發送 Pull Request 前確保您的程式碼通過所有品質檢查。

本專案嚴格遵守 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 規範。您可以使用 `pnpm commit` 來確保您的提交訊息符合格式。

## 🔮 後續發展建議

- **元件庫文件**: 為 `packages/ui` 增加 Storybook 或類似工具，以建立元件文件和互動式展示。
- **狀態管理**: 根據應用複雜度，考慮引入 Zustand, Redux Toolkit 或其他狀態管理方案。
- **CI/CD**: 建立自動化的持續整合與部署流程 (例如使用 GitHub Actions)，在程式碼推送到主分支時自動執行測試、建構和部署。
