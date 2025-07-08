/// <reference types="vitest/globals" />
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import type { AuthResponse } from '@axiom/types';
import { RegisterPage } from './RegisterPage';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { render } from '@/test/test-utils'; // 導入共享的 render 函式

// Mock 依賴項
// 使用同步工廠函式來 mock 模組。這可以解決在某些複雜情況下，
// Vitest 的解析器與非同步 mock 工廠函式之間的路徑解析問題。
vi.mock('@/hooks/useAuth', () => ({
  useRegister: vi.fn(),
  useLogin: vi.fn(), // 即使此測試未使用，也一併 mock 以確保一致性
  useLogout: vi.fn(),
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

describe('RegisterPage', () => {
  // 將 render 邏輯移至此處，使其更具可讀性
  // 修正：使用 `null` 作為未認證狀態的預設值，而不是 `{}` (空物件是 truthy)
  // 這能確保 `if (auth)` 的檢查行為與真實情況一致。
  const renderWithRoutes = (initialAuth: AuthResponse | null = null) => {
    (useAuthStore as vi.Mock).mockReturnValue({ auth: initialAuth });
    // 使用共享的 render 函式，並傳入路由設定
    render(
      <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<div>成功導向到個人資料頁</div>} />
      </Routes>,
      { memoryRouterProps: { initialEntries: ['/register'] } }
    );
  };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // 預設的 useRegister mock 回傳值
    (useRegister as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });
  });

  // 確保在每次測試後清理 DOM，解決因重複渲染導致的「找到多個元素」錯誤。
  // 這是確保測試之間完全隔離的最佳實踐。
  afterEach(() => {
    cleanup();
  });

  it('應正確渲染所有 UI 元件', () => {
    // Arrange
    renderWithRoutes();

    // Assert
    expect(screen.getByRole('heading', { name: '註冊' })).toBeInTheDocument();
    expect(screen.getByLabelText('名稱')).toBeInTheDocument();
    expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
    expect(screen.getByLabelText('密碼')).toBeInTheDocument();
    expect(screen.getByLabelText('確認密碼')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '註冊' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '登入' })).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('如果使用者已登入，應導向到 /profile', () => {
    // Arrange
    // 修正：提供一個符合 AuthResponse 型別的完整 mock 物件
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
    expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
  });

  it('當密碼不匹配時，應顯示錯誤訊息', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRoutes();

    // Act
    await user.type(screen.getByLabelText('名稱'), 'Test User');
    await user.type(screen.getByLabelText('電子郵件'), 'test@example.com');
    await user.type(screen.getByLabelText('密碼'), 'password123');
    await user.type(screen.getByLabelText('確認密碼'), 'password456');
    await user.click(screen.getByRole('button', { name: '註冊' }));

    // Assert
    expect(
      await screen.findByTestId('confirm-password-error')
    ).toHaveTextContent('密碼不匹配');
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('當提交有效表單時，應呼叫註冊 mutation', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({}); // 模擬成功的回應
    renderWithRoutes();

    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    await user.type(screen.getByLabelText('名稱'), userData.name);
    await user.type(screen.getByLabelText('電子郵件'), userData.email);
    await user.type(screen.getByLabelText('密碼'), userData.password);
    await user.type(screen.getByLabelText('確認密碼'), userData.password);
    // await user.click(screen.getByLabel)
    await user.click(screen.getByRole('button', { name: '註冊' }));

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      // 驗證傳遞的資料包含 confirmPassword，因為這是表單的原始資料
      expect(mockMutateAsync).toHaveBeenCalledWith({
        ...userData,
        confirmPassword: 'password123',
      });
    });
  });

  it('在註冊期間，按鈕應顯示 "註冊中..." 並被禁用', async () => {
    // Arrange
    (useRegister as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true, // 模擬正在處理中
      error: null,
    });
    renderWithRoutes();

    // Assert
    const button = screen.getByRole('button', { name: '註冊中...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('當註冊 API 失敗時，應顯示錯誤訊息', async () => {
    // Arrange
    const errorMessage = '此電子郵件已被註冊';
    (useRegister as vi.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: new Error(errorMessage), // 模擬 API 錯誤
    });
    renderWithRoutes();

    // Assert
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
