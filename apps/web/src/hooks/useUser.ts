import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sender } from '@/lib/api';
import type { UserProfile } from '@axiom/types';

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserDto>({
    mutationFn: (userData: UpdateUserDto) =>
      sender<UserProfile>('/user/profile', { arg: userData }),
    onSuccess: (updatedUser: UserProfile) => {
      queryClient.setQueryData(['user'], updatedUser);
    },
  });
};
