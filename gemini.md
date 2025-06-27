
# Gemini Agent 開發指南：現代網頁專案

歡迎！本文件旨在指導 Gemini AI Agent 在此專案中的行為，以確保程式碼的品質、一致性和可維護性。請在所有開發任務中嚴格遵守以下準則。

## 1. 專案概覽與架構

本專案是一個採用 **Monorepo** 架構的現代網頁應用，主要由以下部分組成：

- **前端 (Frontend)**: 使用 **Next.js** 框架，負責使用者介面和客戶端邏輯。
- **後端 (Backend)**: 使用 **Node.js** (建議搭配 Express.js 或 Fastify)，提供 RESTful API 服務。
- **共享套件 (Packages)**: 存放跨專案共享的程式碼，如 `types`, `utils` 等。

**核心原則**: 嚴格分離前後端職責。前端專注於 UI/UX，後端專注於業務邏輯和資料處理。兩者之間僅透過定義好的 API 進行通訊。

## 2. 技術慣例

### 前端 (Next.js)

- **路由 (Routing)**: 優先使用 Next.js 的 **App Router** (`app/` 目錄)。
- **元件 (Components)**: 
    - 遵循**原子設計 (Atomic Design)** 原則，將可重用元件放在 `packages/ui` 中。
    - 頁面級或特定功能的元件則存放在 `apps/web/src/components`。
    - 盡可能使用 **Server Components** 以提升效能。
- **資料獲取 (Data Fetching)**: 
    - 靜態頁面使用 `generateStaticParams`。
    - 伺服器端渲染 (SSR) 或需要動態資料的頁面，在 Server Components 中直接使用 `async/await`。
    - 客戶端資料獲取建議使用 `SWR` 或 `React Query`。
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

- **前端**: 
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
- **禁止未經討論就引入大型或新的依賴套件**。請先在團隊中提出並討論其必要性。

---
感謝您的合作！讓我們一起打造一個高品質的專案。
