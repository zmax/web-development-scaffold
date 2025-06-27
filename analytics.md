# 專案分析：my-web-scaffold

## 1. 總覽

本專案 (`my-web-scaffold`) 是一個基於 **pnpm workspace** 的 **Monorepo**，旨在提供一個現代化、可擴展的網頁應用程式開發骨架。它整合了業界最佳實踐，包含獨立的前端應用、可共享的 UI 元件、工具函式庫和型別定義。

**核心目標：**

*   **程式碼共享與重用**：透過 `packages` 目錄，在不同應用之間共享 UI 元件、工具函式和型別定義。
*   **開發效率**：利用 Vite 提供快速的開發伺服器和建構流程。
*   **程式碼品質**：整合 ESLint, Prettier, TypeScript 和自動化的 Git 鉤子，確保程式碼風格一致且型別安全。
*   **結構化與可維護性**：清晰的目錄結構和模組化設計，便於團隊協作和長期維護。

## 2. 技術棧

| 分類 | 技術 | 用途 |
| :--- | :--- | :--- |
| **主要框架** | React 18 | 建立使用者介面的核心函式庫。 |
| **建構工具** | Vite | 提供極速的開發伺服器和優化的生產環境建構。 |
| **語言** | TypeScript | 為專案提供靜態型別檢查，提升程式碼健壯性。 |
| **樣式** | Tailwind CSS | 一個 Utility-First 的 CSS 框架，用於快速設計 UI。 |
| **套件管理** | pnpm | 高效能的套件管理器，並透過 workspace 功能支援 Monorepo。 |
| **測試** | Vitest, React Testing Library | 用於單元測試和元件測試，確保程式碼品質。 |
| **程式碼規範** | ESLint, Prettier | 強制程式碼風格和語法規範。 |
| **Commit 規範** | Commitlint, cz-conventional-changelog | 確保 Git 提交訊息的一致性和可讀性。 |
| **Git 鉤子** | Husky | 在 Git 事件（如 commit, push）觸發時自動執行腳本。 |

## 3. 專案結構

```
.
├── apps
│   └── web/              # 主要的網頁應用
├── packages
│   ├── types/            # 共享的 TypeScript 型別定義
│   ├── ui/               # 可重用的 React UI 元件庫
│   └── utils/            # 通用的工具函式
├── .commitlintrc.js      # Commitlint 設定
├── .gitignore
├── eslint.config.js      # ESLint 設定
├── package.json          # 根目錄 package.json，定義工作區和共享腳本
├── pnpm-lock.yaml
├── pnpm-workspace.yaml   # pnpm workspace 設定
├── prettier.config.js    # Prettier 設定
├── README.md
├── tailwind.config.js    # Tailwind CSS 設定
└── tsconfig.json         # 根目錄 TypeScript 設定
```

### 3.1. `apps/web`

*   **用途**: 主要的可部署前端應用程式。
*   **技術**: React, Vite, Tailwind CSS。
*   **核心檔案**:
    *   `index.html`: 應用程式進入點 HTML。
    *   `src/main.tsx`: React 應用程式的根節點。
    *   `src/App.tsx`: 主要的應用程式元件。
    *   `vite.config.ts`: Vite 的設定檔。

### 3.2. `packages`

#### `packages/types`

*   **用途**: 存放整個專案共享的 TypeScript 型別定義。
*   **範例**: `src/user.ts` 可能定義了 `User` 的介面，可供前端應用和未來可能的後端服務使用。

#### `packages/ui`

*   **用途**: 一個獨立的 React 元件庫。
*   **範例**: `src/components/Button.tsx` 是一個可自訂樣式和行為的按鈕元件，可以在 `apps/web` 中直接引入使用。
*   **優點**: 促進 UI 的一致性，並減少重複開發。

#### `packages/utils`

*   **用途**: 存放通用的工具函式。
*   **範例**:
    *   `src/cn.ts`: 一個用於合併 Tailwind CSS class names 的輔助函式。
    *   `src/date.ts`: 提供日期格式化或處理的相關函式。

## 4. 開發工作流程

專案的 `package.json` 中定義了一系列腳本，以簡化開發流程：

*   **啟動開發環境**:
    ```bash
    pnpm dev
    ```
    此命令會啟動 `apps/web` 的 Vite 開發伺服器。

*   **執行測試**:
    ```bash
    pnpm test
    ```
    此命令會執行所有 `packages` 和 `apps` 中的測試。若要使用監聽模式，可執行 `pnpm test:watch`。

*   **程式碼品質檢查**:
    *   `pnpm lint`: 檢查整個專案的程式碼風格。
    *   `pnpm format`: 自動格式化所有檔案。
    *   `pnpm type-check`: 執行 TypeScript 的型別檢查。

*   **提交程式碼**:
    當你執行 `git commit` 時，`husky` 會觸發 `pre-commit` 鉤子，自動執行 `lint-staged`，對暫存區的檔案進行 lint 和 format。同時，`commit-msg` 鉤子會使用 `commitlint` 檢查你的提交訊息是否符合規範。若要使用輔助工具產生提交訊息，可執行：
    ```bash
    pnpm commit
    ```

*   **建構專案**:
    ```bash
    pnpm build
    ```
    此命令會建構所有 `packages` 和 `apps`，產生可用於生產環境的檔案。

## 5. 總結與建議

這個專案骨架提供了一個非常穩固和現代化的基礎，適用於建構中大型的網頁應用程式。

**主要優勢**:

*   **模組化與可擴展性**: Monorepo 結構使得新增應用或共享套件變得簡單。
*   **開發體驗**: Vite 提供了無與倫比的開發速度。
*   **程式碼品質保證**: 整合了完整的靜態分析、格式化和測試工具鏈。
*   **清晰的結構**: 職責分離明確，易於理解和維護。

**後續發展建議**:

*   **元件庫文件**: 為 `packages/ui` 增加 Storybook 或類似工具，以建立元件文件和互動式展示。
*   **狀態管理**: 根據應用複雜度，考慮引入 Zustand, Redux Toolkit 或其他狀態管理方案。
*   **CI/CD**: 建立自動化的持續整合與部署流程 (例如使用 GitHub Actions)，在程式碼推送到主分支時自動執行測試、建構和部署。