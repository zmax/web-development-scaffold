import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateUser } from './useUser';
import { api } from '@/lib/api';
import type { UserProfile } from '@axiom/types';

/**
 * @file useUser.test.tsx
 * @description useUser hook 的測試檔案。
 *
 * @testplan
 * 1. **成功更新 (Successful Update)**
 *    - [x] 當 mutation 觸發時，應立即對快取進行樂觀更新。
 *    - [x] 應使用正確的資料呼叫 `api.patch`。
 *    - [x] mutation 成功後，應使相關的 query 失效以重新獲取最新資料。
 *
 * 2. **失敗更新 (Failed Update)**
 *    - [x] 當 mutation 失敗時，應將快取回滾至更新前的狀態。
 *    - [x] 即使失敗，`onSettled` 仍應被觸發，使 query 失效。
 */

// Mock 依賴項
vi.mock('@/lib/api');

// 建立一個輔助函式，為每個測試提供一個乾淨的 QueryClient 和 Wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 在測試中關閉重試，以獲得立即的回饋
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe('useUpdateUser', () => {
  const mockedApiPatch = vi.mocked(api.patch);

  const initialUser: UserProfile = {
    id: 'user-1',
    name: '舊名字',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('應樂觀地更新使用者資料，並在成功後使 query 失效', async () => {
    // Arrange
    const { wrapper, queryClient } = createWrapper();
    // 預先在快取中填入初始使用者資料
    queryClient.setQueryData(['me'], initialUser);

    const updatedUserData = { name: '新名字' };
    const expectedServerResponse: UserProfile = {
      ...initialUser,
      ...updatedUserData,
    };
    mockedApiPatch.mockResolvedValue(expectedServerResponse);

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    // Act
    const mutationPromise = result.current.mutateAsync(updatedUserData);

    // Assert: 驗證樂觀更新是否立即發生
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<UserProfile>(['me']);
      expect(cachedData?.name).toBe('新名字');
    });

    // 等待 mutation 完全結束
    await mutationPromise;

    // Assert: 驗證 API 是否被正確呼叫
    expect(mockedApiPatch).toHaveBeenCalledTimes(1);
    expect(mockedApiPatch).toHaveBeenCalledWith('/users/me', updatedUserData);

    // Assert: 驗證 query 是否被正確地設為失效
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me'] });
  });

  it('應在 mutation 失敗時將資料回滾至更新前的狀態', async () => {
    // Arrange
    const { wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(['me'], initialUser);

    const updatedUserData = { name: '一個不會成功的名字' };
    const error = new Error('伺服器錯誤，更新失敗');
    mockedApiPatch.mockRejectedValue(error);

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    // Act & Assert: 驗證 mutation 是否如預期般拋出錯誤
    await expect(result.current.mutateAsync(updatedUserData)).rejects.toThrow(
      error
    );

    // Assert: 驗證快取中的資料是否已成功回滾
    const cachedData = queryClient.getQueryData<UserProfile>(['me']);
    expect(cachedData?.name).toBe('舊名字');

    // Assert: 驗證 onSettled 依然被呼叫，即使在失敗的情況下
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['me'] });
  });
});
