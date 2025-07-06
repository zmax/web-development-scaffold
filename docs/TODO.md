# 專案開發待辦事項 (TODO)

本文件用於追蹤 `axiom` 專案的開發進度。

## Phase 1: 後端 API 基礎建設 (Backend API Foundation)

- [x] 在 `apps/` 目錄下建立一個名為 `api` 的新專案。
- [x] 為 `api` 專案安裝 Node.js, Express.js (或 Fastify), 和 TypeScript。
- [x] 設定 `tsconfig.json` 和基礎的資料夾結構 (e.g., `src/`, `dist/`)。
- [x] 整合 Prisma ORM 並建立初步的 `schema.prisma` 檔案。
- [x] 根據 `packages/types` 中的定義，在 `schema.prisma` 中建立 `User` model。
- [x] 實作基於 JWT 的基礎身份驗證機制 (註冊/登入)。
- [x] 建立第一個受保護的 API 端點 (e.g., `GET /api/v1/users/me`)。
- [ ] 整合 Swagger (OpenAPI) 以提供 API 文件與互動式測試介面。

## Phase 2: 前端功能擴充 (Frontend Feature Expansion)

- [x] 引入 `react-router-dom` 並設定基礎路由 (首頁, 登入, 註冊, 個人資料頁)。
- [x] 建立登入與註冊頁面的表單元件。
- [x] 引入 `Zustand` 來進行全域使用者狀態管理 (e.g., `authStore`)。
- [x] 整合資料獲取庫來處理對後端 API 的請求 (註：最終選擇並整合了 `@tanstack/react-query`)。
- [x] 在 `packages/ui` 中建立更多通用元件 (`Input`, `Label`, `Card`)。

## Phase 3: 測試與品質保證 (Testing & QA)

- [x] 為 `packages/utils` 中的所有函式編寫單元測試。
- [x] 為 `packages/ui` 中的核心元件編寫單元測試。
- [x] 為後端 API 的核心業務邏輯 (e.g., 驗證服務) 編寫單元測試。
- [ ] 為後端 API 端點編寫整合測試 (e.g., using Supertest)，驗證完整的請求-回應流程。
- [ ] (長期) 引入 Playwright 或 Cypress 並為使用者登入/註冊流程編寫 E2E 測試。

## Phase 4: 自動化與部署 (Automation & Deployment)

- [ ] 建立 GitHub Actions 工作流程。
- [ ] 設定 CI 流程，自動執行 Linting, Testing 和 Building。
