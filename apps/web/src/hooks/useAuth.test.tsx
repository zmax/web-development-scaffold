import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SWRConfig } from 'swr';
import { useLogin } from './useAuth';
import * as api from '@/lib/api';
import type { AuthResponse } from '@types';

describe('useLogin Hook', () => {
  // 建立一個 wrapper，提供 SWR 所需的 context
  // 每次測試都使用一個新的、乾淨的快取
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );

  const mockLoginCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockSuccessResponse: AuthResponse = {
    token: 'mock-jwt-token',
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  beforeEach(() => {
    // 在每個測試案例開始前，重置所有模擬
    // 使用 restoreAllMocks 來確保 spyOn 建立的模擬在測試後能還原
    vi.restoreAllMocks();
  });

  it('應該在成功登入時觸發 mutation 並返回資料', async () => {
    // 安排 (Arrange)
    const senderSpy = vi
      .spyOn(api, 'sender')
      .mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.isLoggingIn).toBe(false); // 驗證初始狀態

    // 斷言 (Assert)
    // 使用 await act 等待所有非同步狀態更新完成
    await act(async () => {
      const response = await result.current.login(mockLoginCredentials);
      expect(response).toEqual(mockSuccessResponse);
    });

    // 驗證最終狀態
    expect(result.current.isLoggingIn).toBe(false);
    expect(result.current.loginError).toBeUndefined();
    expect(senderSpy).toHaveBeenCalledWith('/auth/login', {
      arg: mockLoginCredentials,
    });
  });

  it('應該在登入失敗時處理錯誤狀態', async () => {
    // 安排 (Arrange)
    const mockError = new api.ApiError(401, '電子郵件或密碼不正確');
    const senderSpy = vi.spyOn(api, 'sender').mockRejectedValue(mockError);
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.isLoggingIn).toBe(false); // 驗證初始狀態

    // 斷言 (Assert)
    // 使用 await act 等待所有非同步狀態更新完成
    await act(async () => {
      await expect(result.current.login(mockLoginCredentials)).rejects.toThrow(
        mockError
      );
    });

    // 驗證最終狀態
    expect(result.current.isLoggingIn).toBe(false);
    expect(result.current.loginError).toBe(mockError);
    expect(senderSpy).toHaveBeenCalledWith('/auth/login', {
      arg: mockLoginCredentials,
    });
  });
});
