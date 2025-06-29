import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';
import * as AuthHooks from '@/hooks/useAuth';
import { useAuthStore } from '@/stores';
import type { AuthResponse } from '@types';
import type { ApiError } from '@/lib/api';

// 模擬整個 @/hooks/useAuth 模組
vi.mock('@/hooks/useAuth', async importOriginal => {
  const actual = await importOriginal<typeof AuthHooks>();
  return {
    ...actual,
    // 只模擬 useRegister hook
    useRegister: vi.fn(),
  };
});

// 模擬 react-router-dom 的 useNavigate
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// 模擬 zustand store
vi.mock('@/stores');

describe('RegisterPage', () => {
  const mockRegisterUser = vi.fn();
  const mockNavigate = vi.fn();
  const mockSetAuth = vi.fn();
  const mockedUseRegister = vi.mocked(AuthHooks.useRegister);

  beforeEach(() => {
    vi.resetAllMocks();
    // 為每個測試設定預設的模擬回傳值
    mockedUseRegister.mockReturnValue({
      registerUser: mockRegisterUser,
      isRegistering: false,
      registerError: null,
    });
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    (useAuthStore as vi.Mock).mockReturnValue({
      setAuth: mockSetAuth,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
  };

  it('應該渲染所有表單欄位和提交按鈕', () => {
    renderComponent();
    expect(screen.getByLabelText('名稱')).toBeInTheDocument();
    expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
    expect(screen.getByLabelText('密碼')).toBeInTheDocument();
    expect(screen.getByLabelText('確認密碼')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /建立帳戶/i })
    ).toBeInTheDocument();
  });

  it('當提交空表單時，應該顯示驗證錯誤', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: /建立帳戶/i });
    await userEvent.click(submitButton);

    // react-hook-form 的驗證是異步的
    expect(await screen.findByText('名稱為必填項')).toBeInTheDocument();
    expect(await screen.findByText('請輸入有效的電子郵件')).toBeInTheDocument();
    expect(
      await screen.findByText('密碼至少需要 6 個字元')
    ).toBeInTheDocument();
  });

  it('當密碼不匹配時，應該顯示驗證錯誤', async () => {
    renderComponent();
    await userEvent.type(screen.getByLabelText('名稱'), 'Test User');
    await userEvent.type(screen.getByLabelText('電子郵件'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('密碼'), 'password123');
    await userEvent.type(screen.getByLabelText('確認密碼'), 'password456');

    await userEvent.click(screen.getByRole('button', { name: /建立帳戶/i }));

    expect(await screen.findByText('兩次輸入的密碼不一致')).toBeInTheDocument();
  });

  it('當提交有效資料時，應該呼叫 registerUser', async () => {
    renderComponent();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    await userEvent.type(screen.getByLabelText('名稱'), userData.name);
    await userEvent.type(screen.getByLabelText('電子郵件'), userData.email);
    await userEvent.type(screen.getByLabelText('密碼'), userData.password);
    await userEvent.type(screen.getByLabelText('確認密碼'), userData.password);

    await userEvent.click(screen.getByRole('button', { name: /建立帳戶/i }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledTimes(1);
      expect(mockRegisterUser).toHaveBeenCalledWith({
        ...userData,
        confirmPassword: userData.password,
      });
    });
  });

  it('當 isRegistering 為 true 時，應該禁用按鈕並顯示載入文字', () => {
    // 為此測試覆寫預設的模擬
    mockedUseRegister.mockReturnValue({
      registerUser: mockRegisterUser,
      isRegistering: true,
      registerError: null,
    });

    renderComponent();

    const submitButton = screen.getByRole('button', { name: /處理中.../i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('註冊成功後應該呼叫 setAuth 並導向個人資料頁', async () => {
    // Arrange
    const mockAuthResponse: AuthResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    mockRegisterUser.mockResolvedValue(mockAuthResponse);

    renderComponent();

    // Act
    await userEvent.type(screen.getByLabelText('名稱'), 'Test User');
    await userEvent.type(screen.getByLabelText('電子郵件'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('密碼'), 'password123');
    await userEvent.type(screen.getByLabelText('確認密碼'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /建立帳戶/i }));

    // Assert
    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockAuthResponse.user,
        mockAuthResponse.token
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
    });
  });

  it('當 API 返回錯誤時，應該顯示錯誤訊息', async () => {
    // Arrange
    const mockError = { message: '此電子郵件已被註冊' } as ApiError;
    mockedUseRegister.mockReturnValue({
      registerUser: mockRegisterUser,
      isRegistering: false,
      registerError: mockError,
    });

    renderComponent();

    // Assert
    expect(await screen.findByText('此電子郵件已被註冊')).toBeInTheDocument();
  });
});
