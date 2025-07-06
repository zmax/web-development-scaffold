# Axiom 專案開發準則 (Project Development Guidelines)

歡迎！本文件旨在為 Axiom 專案的所有開發者（包含人類與 AI 協作者）提供一套統一的開發準則，以確保程式碼的品質、一致性和可維護性。請在所有開發任務中嚴格遵守以下準則。

## 0. 閱讀前提 (Prerequisite Reading)

**在進行任何規劃或修改原始碼之前，請務必完整閱讀 `docs/` 目錄下的所有核心文件。**

這將確保您充分理解專案的目標、架構決策和當前進度，從而使您的貢獻與專案的整體方向保持一致。

- **`docs/prd.md`**: 了解產品的願景、目標和功能需求。
- **`docs/adr/*.md`**: 了解所有重要的架構決策及其背後的理由。
- **`docs/TODO.md`**: 了解專案的開發路線圖和當前的待辦事項。

## 1. 專案概覽與架構

本專案是一個採用 **Monorepo** 架構的現代網頁應用，主要由以下部分組成：

- **前端 (Frontend)**: 使用 **Vite + React**，負責使用者介面和客戶端邏輯。
- **後端 (Backend)**: 使用 **Node.js** (建議搭配 Express.js 或 Fastify)，提供 RESTful API 服務。
- **共享套件 (Packages)**: 存放跨專案共享的程式碼，如 `types`, `utils` 等。

**核心原則**: 嚴格分離前後端職責。前端專注於 UI/UX，後端專注於業務邏輯和資料處理。兩者之間僅透過定義好的 API 進行通訊。

### 架構決策紀錄 (ADR)

為了確保所有重要的技術決策都有據可循，本專案採用「架構決策紀錄 (Architecture Decision Records, ADRs)」來記錄這些決策的過程與結果。

- **編寫時機**: 當遇到以下情況時，應建立一份新的 ADR：
  - 引入對專案有顯著影響的新技術、框架或大型依賴套件（例如：更換狀態管理庫、引入新的資料庫 ORM）。
  - 變更核心的架構模式或流程（例如：修改認證機制、調整 API 設計風格）。
  - 做出一個具有長期影響且未來難以輕易更改的技術選擇。
  - 當一個問題有多個可行的解決方案，且團隊需要記錄選擇某個方案的權衡取捨時。

- **編寫流程**:
  1.  從 `docs/adr/adr-template.md` 複製一份範本。
  2.  建立新檔案，命名格式為 `NNNN-kebab-case-title.md`（NNNN 為流水號）。
  3.  將 ADR 的狀態設為「**提議中 (Proposed)**」，並詳述背景、決策與後果。
  4.  透過 **Pull Request (PR)** 發起團隊討論。
  5.  決策達成共識後，將狀態更新為「**已接受 (Accepted)**」或「**已拒絕 (Rejected)**」，並將 PR 合併。

## 2. 技術慣例

### 前端 (Vite + React)

- **路由 (Routing)**: 使用 **React Router** (`react-router-dom`) 進行客戶端路由管理。
- **元件 (Components)**:
  - 遵循**原子設計 (Atomic Design)** 原則，將可重用元件放在 `packages/ui` 中。
  - 頁面級或特定功能的元件則存放在 `apps/web/src/components`。
- **資料獲取 (Data Fetching)**:
  - 本專案**標準化使用 React Query (`@tanstack/react-query`)** 來處理客戶端的 API 請求、快取和狀態同步。
- **狀態管理 (State Management)**:
  - 優先使用 React 內建的 `useState`, `useContext`, `useReducer`。
  - 對於複雜的全域狀態，優先考慮使用 **Zustand**，其次是 Redux Toolkit。
- **樣式 (Styling)**:
  - 專案已設定 **Tailwind CSS**，請務必使用其 utility classes 進行樣式設計。
  - 避免使用傳統的 CSS Modules 或 Styled-components，以保持一致性。

### 後端 (Node.js)

- **框架 (Framework)**: 建議使用 **Express.js** 或 **Fastify** 來建構 API 伺服器。
- **API 設計**:
  - 設計遵循 **RESTful** 風格。
  - API 路徑應加上版本號，例如 `/api/v1/...`。
  - 使用 OpenAPI (Swagger) 規範來定義和記錄 API。
- **資料庫**:
  - 建議使用 **Prisma** 作為 ORM，以確保型別安全和簡化資料庫操作。
- **身份驗證 (Authentication)**:
  - 使用 **JWT (JSON Web Tokens)** 進行無狀態驗證。
  - 密碼儲存必須使用 `bcrypt` 進行雜湊處理。
- **錯誤處理 (Error Handling)**:
  - 建立一個集中的錯誤處理中介軟體 (middleware)。
  - 回傳的錯誤訊息應有固定的格式，例如 `{ "statusCode": 400, "message": "Invalid input", "errors": [...] }`。

## 3. 程式碼品質與規範

- **語言**: **TypeScript First**。所有新程式碼都必須使用 TypeScript 撰寫，並盡可能提供明確的型別定義。
- **命名**:
  - 變數和函式使用 `camelCase`。
  - 元件和型別使用 `PascalCase`。
  - 檔案名稱使用 `kebab-case` (例如 `user-profile.tsx`)。
- **匯出/匯入 (Export/Import)**:
  - 優先使用具名匯出 (`export const ...`) 而非預設匯出 (`export default ...`)，以增加重構的便利性和可追蹤性。
  - 匯入路徑應使用 `tsconfig.json` 中定義的**路徑別名** (e.g., `@/components/...`)。
- **Linting & Formatting**:
  - 專案已整合 ESLint 和 Prettier。所有提交的程式碼都**必須**通過 `pnpm lint` 和 `pnpm format` 的檢查。
- **註解 (Comments)**:
  - 註解應簡潔明瞭，只在必要時加入。
  - 優先解釋「**為什麼 (Why)**」這樣做，而不是「**做什麼 (What)**」。

## 4. 測試策略

- **開發模式**: **測試驅動開發 (TDD)**。所有新功能都應遵循「紅-綠-重構」的循環：先為新功能撰寫一個會失敗的測試 (紅)，然後撰寫最精簡的程式碼讓測試通過 (綠)，最後重構程式碼以提升品質。

- **前端**:
  - **測試即文件 (Tests as Documentation)**:
    - **核心原則**: 我們採用「程式碼即文件」的理念。測試的「規劃」與「實作」應緊密結合，避免在外部文件（如 `docs/`）中維護獨立的測試清單，以降低維護成本並防止文件過期。
    - **實作方式**:
      - **測試計畫 (`@testplan`)**: 在每個測試檔案 (`*.test.tsx`) 的頂部，使用 JSDoc 註解來撰寫一個清晰的 `@testplan`。這個計畫列出了該元件需要被測試的所有情境。
      - **描述性命名**: `describe` 和 `it` 區塊的標題應使用清晰、完整的句子來描述測試的行為，使其本身就成為一份可讀的規格文件。
    - **TDD 整合流程**:
      1.  在 `@testplan` 中新增一個待辦項目，例如 `- [ ] 應處理無效輸入`。
      2.  撰寫對應的 `it('should handle invalid input', ...)` 測試案例，並確認它會失敗（紅）。
      3.  撰寫最精簡的產品程式碼讓測試通過（綠）。
      4.  重構程式碼與測試碼。
      5.  測試通過後，回到 `@testplan` 將項目更新為 `- [x] 應處理無效輸入`。
  - **單元/整合測試**: 使用 **Vitest** 和 **React Testing Library** 測試元件和 hooks。
  - **E2E 測試**: 建議使用 **Playwright** 或 **Cypress** 進行端對端測試。
- **後端**:
  - **單元測試**: 使用 **Vitest** 或 **Jest** 測試獨立的業務邏輯單元。
  - **整合測試**: 測試 API 端點，驗證請求和回應是否符合預期。
- **測試覆蓋率**: 所有新功能都應伴隨相應的測試，目標是核心業務邏輯達到 80% 以上的測試覆蓋率。

## 5. Git 與提交規範

- **分支 (Branching)**:
  - `main`: 主分支，代表生產環境的穩定版本。
  - `develop`: 開發分支，所有功能分支從此建立。
  - `feat/...`: 功能分支 (e.g., `feat/user-authentication`)。
  - `fix/...`: 錯誤修復分支 (e.g., `fix/login-button-bug`)。
- **提交訊息 (Commit Messages)**:
  - **嚴格遵守 Conventional Commits 規範**。
  - 使用 `pnpm commit` 指令可以啟動 Commitizen，引導您產生合規的提交訊息。

## 6. 禁止事項

- **禁止直接推送至 `main` 或 `develop` 分支**。所有變更都必須透過 Pull Request (PR) 進行審查。
- **禁止在程式碼中寫入敏感資訊** (如 API 金鑰、密碼)。請使用環境變數 (`.env`)。
- **禁止未經 ADR 流程就進行重大的架構變更或引入新的大型依賴套件**。請遵循「架構決策紀錄」一節中定義的流程。

---

感謝您的合作！讓我們一起打造一個高品質的專案。
