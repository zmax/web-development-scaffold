import { screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import type { AuthResponse } from '@axiom/types';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { render } from '@/test/test-utils';

/**
 * @file ProtectedRoute.test.tsx
 * @description ProtectedRoute 元件的測試檔案。
 *
 * @testplan
 * 1. **已認證使用者 (Authenticated User)**
 *    - [x] 當使用者已登入時，應正確渲染受保護的子路由元件。
 *
 * 2. **未認證使用者 (Unauthenticated User)**
 *    - [x] 當使用者未登入時，應自動導向至登入頁面 (`/login`)。
 *    - [x] 當使用者未登入時，不應渲染受保護的子路由元件。
 */

// Mock 依賴項
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtectedRoute', () => {
  // 為了測試，定義一個簡單的受保護頁面和一個登入頁面
  const ProtectedPage = () => <div>這是受保護的內容</div>;
  const LoginPage = () => <div>這是登入頁面</div>;

  // 抽離出可重用的 render 函式
  const renderProtectedRoutes = (initialAuth: AuthResponse | null) => {
    (useAuthStore as vi.Mock).mockReturnValue({ auth: initialAuth });

    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<ProtectedPage />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
      </Routes>,
      { memoryRouterProps: { initialEntries: ['/profile'] } }
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('當使用者已登入時，應渲染子路由元件', () => {
    // Arrange: 模擬一個已登入的使用者狀態
    const mockAuth: AuthResponse = {
      token: 'fake-token',
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    renderProtectedRoutes(mockAuth);

    // Assert: 驗證受保護的內容被渲染，且未導向至登入頁
    expect(screen.getByText('這是受保護的內容')).toBeInTheDocument();
    expect(screen.queryByText('這是登入頁面')).not.toBeInTheDocument();
  });

  it('當使用者未登入時，應導向至登入頁面', () => {
    // Arrange: 模擬未登入狀態
    renderProtectedRoutes(null);

    // Assert: 驗證登入頁面被渲染，且受保護的內容未被渲染
    expect(screen.getByText('這是登入頁面')).toBeInTheDocument();
    expect(screen.queryByText('這是受保護的內容')).not.toBeInTheDocument();
  });
});
