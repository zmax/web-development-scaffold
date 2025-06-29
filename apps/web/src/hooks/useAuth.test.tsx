/// <reference types="vitest/globals" />

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useRegister, useLogout } from './useAuth';
import { useAuthStore } from '../stores';
import * as api from '../lib/api';
import type { AuthResponse } from '@axiom/types';

vi.mock('../stores');
vi.mock('../lib/api');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Auth Hooks', () => {
  const mockSetAuth = vi.fn();
  const mockClearAuth = vi.fn();
  const mockSender = vi.mocked(api.sender);

  beforeEach(() => {
    vi.resetAllMocks();
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
    it('should call sender with credentials and set auth on success', async () => {
      mockSender.mockResolvedValue(mockAuthResponse);
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(mockSender).toHaveBeenCalledWith('/auth/login', {
        arg: { email: 'test@example.com', password: 'password' },
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockAuthResponse.user,
        mockAuthResponse.token
      );
    });
  });

  describe('useRegister', () => {
    it('should call sender with user info and set auth on success', async () => {
      mockSender.mockResolvedValue(mockAuthResponse);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'new-password',
      };
      await act(async () => {
        await result.current.mutateAsync(newUser);
      });

      expect(mockSender).toHaveBeenCalledWith('/auth/register', {
        arg: newUser,
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockAuthResponse.user,
        mockAuthResponse.token
      );
    });
  });

  describe('useLogout', () => {
    it('should clear auth and query cache', () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.logout();
      });

      expect(mockClearAuth).toHaveBeenCalled();
    });
  });
});
