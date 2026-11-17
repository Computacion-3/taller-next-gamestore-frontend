'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { authContainer } from '../../di/auth.container';
import {
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/repositories/AuthRepository';
import { AuthMapper } from '../../infrastructure/mappers/AuthMapper';
import { AuthState, authStore } from '../store/auth.slice';

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(() => authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setState);

    // Hidratar sesión desde localStorage si aún no está en memoria
    const current = authStore.getState();
    if (!current.isAuthenticated) {
      const savedToken = authContainer.tokenStorage.getToken();
      const savedUser = authContainer.tokenStorage.getUser();
      if (savedToken && savedUser) {
        authStore.setSession(savedToken, savedUser);
      }
    }

    return unsubscribe;
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      authStore.setLoading(true);
      try {
        const session = await authContainer.loginUseCase.execute(credentials);
        authStore.setSession(
          session.accessToken,
          AuthMapper.userToDto(session.user),
        );
        router.push('/');
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al iniciar sesión.';
        authStore.setError(message);
        throw err;
      }
    },
    [router],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      authStore.setLoading(true);
      try {
        const session =
          await authContainer.registerUseCase.execute(credentials);
        authStore.setSession(
          session.accessToken,
          AuthMapper.userToDto(session.user),
        );
        router.push('/');
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al registrar usuario.';
        authStore.setError(message);
        throw err;
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    authStore.setLoading(true);
    try {
      await authContainer.logoutUseCase.execute();
    } finally {
      authStore.reset();
      router.push('/login');
    }
  }, [router]);

  const clearError = useCallback(() => {
    authStore.setError(null);
  }, []);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.user?.role === 'admin',
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };
}
