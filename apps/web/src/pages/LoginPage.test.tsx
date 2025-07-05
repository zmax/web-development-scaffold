import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import { LoginPage } from './LoginPage';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { render } from '@/test/test-utils';

/**
 * @file LoginPage.test.tsx
 * @description LoginPage 元件的測試檔案。
 *
 * @testplan
 * 1. **初始渲染 (Initial Render)**
 *    - [x] 應正確渲染頁面標題 "登入"。
 *    - [x] 應渲染 "電子郵件" 和 "密碼" 輸入欄位。
 *    - [x] 應渲染 "登入" 按鈕。
 *    - [x] 應渲染一個連結，指向註冊頁面 (`/register`)。
 *
 * 2. **路由與認證狀態 (Routing & Auth State)**
 *    - [x] 如果使用者**已經是登入狀態**，頁面應自動導向到個人資料頁 (`/profile`)。
 *
 * 3. **表單驗證 (Form Validation)**
 *    - [x] 當使用者未填寫任何欄位就提交時，應顯示各欄位的必填錯誤訊息。
 *
 * 4. **使用者互動與 API 呼叫 (User Interaction & API Calls)**
 *    - [x] 當使用者填寫有效的表單資料並提交時，`useLogin` hook 的 `mutateAsync` 函式應被呼叫。
 *    - [x] 在提交過程中，按鈕應顯示為 "登入中..." 並且處於禁用 (disabled) 狀態。
 *    - [x] 當登入 API 呼叫失敗時，應在頁面上顯示從 `useLogin` hook 傳來的錯誤訊息。
 *
 * @note 每個測試案例都遵循 Arrange-Act-Assert (3A) 模式。
 */

// Mock 依賴項
vi.mock('@/hooks/useAuth', () => ({
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

describe('LoginPage', () => {
  const mockMutateAsync = vi.fn();

  // 輔助函式，用於渲染元件並設定路由
  const renderWithRoutes = (initialAuth = null) => {
    (useAuthStore as vi.Mock).mockReturnValue({ auth: initialAuth });
    render(
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<div>成功導向到個人資料頁</div>} />
      </Routes>,
      { memoryRouterProps: { initialEntries: ['/login'] } }
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 為 useLogin 提供預設的 mock 回傳值
    (useLogin as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });
  });

  it('應正確渲染所有 UI 元件', () => {
    // Arrange
    renderWithRoutes();

    // Assert
    expect(screen.getByRole('heading', { name: '登入' })).toBeInTheDocument();
    expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
    expect(screen.getByLabelText('密碼')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '註冊' })).toHaveAttribute(
      'href',
      '/register'
    );
  });

  it('如果使用者已登入，應導向到 /profile', () => {
    // Arrange
    const mockAuth = {
      token: 'abc',
      user: {
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    renderWithRoutes(mockAuth);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('當提交空表單時，應顯示驗證錯誤', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRoutes();

    // Act
    await user.click(screen.getByRole('button', { name: '登入' }));

    // Assert
    expect(
      await screen.findByText('請輸入有效的電子郵件地址')
    ).toBeInTheDocument();
    expect(await screen.findByText('請輸入密碼')).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('當提交有效表單時，應呼叫登入 mutation', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({}); // 模擬成功回應
    renderWithRoutes();

    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    await user.type(screen.getByLabelText('電子郵件'), credentials.email);
    await user.type(screen.getByLabelText('密碼'), credentials.password);
    await user.click(screen.getByRole('button', { name: '登入' }));

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockMutateAsync).toHaveBeenCalledWith(credentials);
    });
  });

  it('在登入期間，按鈕應顯示 "登入中..." 並被禁用', () => {
    // Arrange
    (useLogin as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true, // 模擬正在處理中
      error: null,
    });
    renderWithRoutes();

    // Assert
    const button = screen.getByRole('button', { name: '登入中...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('當登入 API 失敗時，應顯示錯誤訊息', async () => {
    // Arrange
    const errorMessage = '電子郵件或密碼不正確';
    (useLogin as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: new Error(errorMessage), // 模擬 API 錯誤
    });
    renderWithRoutes();

    // Assert
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
