import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserProfile } from '@axiom/types';

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// 遵循 gemini.md 規範，將 query keys 集中管理，避免魔法字串 (magic strings) 和拼寫錯誤
const userQueryKeys = {
  // 使用 'me' 而非 'user' 來更精確地描述這個 key 代表的是「當前登入的使用者」
  me: ['me'] as const,
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  // 修正：為 useMutation 增加第四個泛型參數，以明確定義 onMutate 回傳的 context 物件類型。
  // 這將解決 onError 回呼中 context 的類型推斷問題。
  return useMutation<
    UserProfile,
    Error,
    UpdateUserDto,
    { previousUser: UserProfile | undefined }
  >({
    // 建議：將 API 路徑改為更符合 RESTful 風格的 /users/me，與 user.controller.ts 的 /me 路由保持一致
    mutationFn: (userData: UpdateUserDto) =>
      api.patch<UserProfile, UpdateUserDto>('/users/me', userData),
    // 步驟 1: onMutate 會在 mutation 函式執行前被觸發
    onMutate: async (newUserData: UpdateUserDto) => {
      // 取消任何可能影響結果的既有查詢
      await queryClient.cancelQueries({ queryKey: userQueryKeys.me });

      // 取得當前快取中的使用者資料，以便在發生錯誤時可以還原
      const previousUser = queryClient.getQueryData<UserProfile>(
        userQueryKeys.me
      );

      // 樂觀地將新資料寫入快取
      if (previousUser) {
        queryClient.setQueryData<UserProfile>(userQueryKeys.me, {
          ...previousUser,
          ...newUserData,
        });
      }

      // 回傳包含舊資料的 context 物件
      return { previousUser };
    },
    // 步驟 2: 如果 mutation 失敗，使用 onMutate 回傳的 context 來還原資料
    // 修正：將未使用的變數加上底線前綴，以符合 TypeScript 的 noUnusedLocals 規則
    onError: (_err, _newUser, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userQueryKeys.me, context.previousUser);
      }
    },
    // 步驟 3: 無論成功或失敗，mutation 結束後都重新擷取使用者資料，確保與後端同步
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me });
    },
  });
};
