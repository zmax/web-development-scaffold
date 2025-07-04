import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useRegister, useLogout } from './useAuth';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import type { AuthResponse } from '@axiom/types';

// Mock the api module
vi.mock('../lib/api');
// Mock the auth store
vi.mock('../stores/authStore');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
};

describe('Auth Hooks', () => {
  const mockSetAuth = vi.fn();
  const mockClearAuth = vi.fn();
  const mockedApiPost = vi.mocked(api.post, true); // 使用 vi.mocked 取得 mock 函式的強型別引用

  beforeEach(() => {
    vi.resetAllMocks();
    // 模擬 Zustand store 的回傳值
    (useAuthStore as unknown as vi.Mock).mockReturnValue({
      setAuth: mockSetAuth,
      clearAuth: mockClearAuth,
    });
  });

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token',
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  describe('useLogin', () => {
    it('應該使用憑證呼叫 API 並在成功時設定認證狀態', async () => {
      mockedApiPost.mockResolvedValue(mockAuthResponse);
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      const credentials = {
        email: 'test@example.com',
        password: 'password',
      };
      await act(async () => {
        await result.current.mutateAsync(credentials);
      });

      expect(mockedApiPost).toHaveBeenCalledWith('/auth/login', credentials);
      expect(mockSetAuth).toHaveBeenCalledWith(mockAuthResponse);
    });
  });

  describe('useRegister', () => {
    it('應該呼叫 API (不含 confirmPassword) 並在成功時設定認證狀態', async () => {
      mockedApiPost.mockResolvedValue(mockAuthResponse);
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'new-password',
        confirmPassword: 'new-password',
      };
      await act(async () => {
        await result.current.mutateAsync(newUser);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...expectedPayload } = newUser;
      expect(mockedApiPost).toHaveBeenCalledWith(
        '/auth/register',
        expectedPayload
      );
      expect(mockSetAuth).toHaveBeenCalledWith(mockAuthResponse);
    });
  });

  describe('useLogout', () => {
    it('應該清除認證狀態和 query 快取', async () => {
      const { wrapper, queryClient } = createWrapper();
      const queryClientSpy = vi.spyOn(queryClient, 'clear');
      const { result } = renderHook(() => useLogout(), { wrapper });

      act(() => {
        result.current(); // useLogout 直接返回一個函式，應直接呼叫
      });

      expect(mockClearAuth).toHaveBeenCalled();
      expect(queryClientSpy).toHaveBeenCalledTimes(1);
    });
  });
});
