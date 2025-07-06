import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import type { AuthResponse } from '@axiom/types';
import { ProfilePage } from './ProfilePage';
// import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { render } from '@/test/test-utils';

/**
 * @file ProfilePage.test.tsx
 * @description ProfilePage 元件的測試檔案。
 *
 * @testplan
 * 1. **資料顯示 (Data Display)**
 *    - [x] 應正確渲染頁面標題 "個人資料"。
 *    - [x] 應顯示從 `useAuthStore` 取得的使用者名稱和電子郵件。
 *    - [x] 應渲染 "登出" 按鈕。
 *
 * 2. **使用者互動 (User Interaction)**
 *    - [x] 當點擊 "登出" 按鈕時，應呼叫 `useLogout` hook 提供的函式。
 *    - [x] 當點擊 "登出" 按鈕時，應導向至登入頁面 (`/login`)。
 *
 * 3. **防禦性渲染 (Defensive Rendering)**
 *    - [x] 如果因意外情況導致 `auth` 物件不存在，元件應不渲染任何內容 (回傳 null)。
 */

// Mock 依賴項
const mockLogout = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  // 確保 mock useLogout 回傳一個可被呼叫的函式
  useLogout: () => mockLogout,
  // Mock 其他 useAuth 中的 hooks 以避免潛在的 import 問題
  useRegister: vi.fn(),
  useLogin: vi.fn(),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProfilePage', () => {
  const mockUser = {
    id: 'user-123',
    name: '陳大文',
    email: 'david.chen@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuth: AuthResponse = {
    token: 'fake-jwt-token',
    user: mockUser,
  };

  const renderProfilePage = (initialAuth: AuthResponse | null) => {
    (useAuthStore as vi.Mock).mockReturnValue({ auth: initialAuth });
    render(
      <Routes>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/login' element={<div>已導向到登入頁</div>} />
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

  it('應正確顯示使用者資料和登出按鈕', () => {
    // Arrange
    renderProfilePage(mockAuth);

    // Assert
    expect(
      screen.getByRole('heading', { name: '個人資料' })
    ).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登出' })).toBeInTheDocument();
  });

  it('點擊登出按鈕時應呼叫 logout 函式並導向至登入頁', async () => {
    // Arrange
    const user = userEvent.setup();
    renderProfilePage(mockAuth);

    // Act
    await user.click(screen.getByRole('button', { name: '登出' }));

    // Assert
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('如果沒有使用者資料，應不渲染任何內容', () => {
    // Arrange
    renderProfilePage(null);

    // Assert
    // 驗證頁面標題不存在，代表元件已正確地回傳 null
    expect(
      screen.queryByRole('heading', { name: '個人資料' })
    ).not.toBeInTheDocument();
  });
});
