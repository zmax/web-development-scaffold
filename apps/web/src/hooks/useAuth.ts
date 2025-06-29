import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { sender } from '@/lib/api';
import type { LoginUserDto, RegisterUserDto, AuthResponse } from '@axiom/types';

export interface AuthStore {
  user: AuthResponse['user'] | null;
  token: string | null;
  setAuth: (user: AuthResponse['user'], token: string) => void;
  clearAuth: () => void;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginUserDto>({
    mutationFn: (credentials: LoginUserDto) =>
      sender<AuthResponse>('/auth/login', { arg: credentials }),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, RegisterUserDto>({
    mutationFn: (userInfo: RegisterUserDto) =>
      sender<AuthResponse>('/auth/register', { arg: userInfo }),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  const logout = () => {
    clearAuth();
    queryClient.clear();
  };

  return { logout };
};
