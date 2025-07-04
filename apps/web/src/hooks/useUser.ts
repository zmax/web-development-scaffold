import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserProfile } from '@axiom/types';

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserDto>({
    mutationFn: (userData: UpdateUserDto) =>
      api.patch<UserProfile, UpdateUserDto>('/user/profile', userData),
    onSuccess: (updatedUser: UserProfile) => {
      queryClient.setQueryData(['user'], updatedUser);
    },
  });
};
