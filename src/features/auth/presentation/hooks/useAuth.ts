'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { authContainer } from '../../di/auth.container';
import { AuthUser, AuthUserProps } from '../../domain/entities/AuthUser';
import {
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/repositories/AuthRepository';
import {
  resetAuthState,
  setAuthError,
  setAuthLoading,
  setAuthSession,
  setAuthUser,
} from '../store/auth.slice';

function toUserProps(user: AuthUser): AuthUserProps {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    walletBalance: user.walletBalance,
  };
}

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.auth);

  useEffect(() => {
    if (!state.isAuthenticated) {
      const stored = authContainer.getStoredSessionUseCase.execute();
      if (stored) {
        dispatch(
          setAuthSession({
            token: stored.accessToken,
            user: toUserProps(stored.user),
          }),
        );
      }
    }
  }, [dispatch, state.isAuthenticated]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch(setAuthLoading(true));
      try {
        const session = await authContainer.loginUseCase.execute(credentials);
        dispatch(
          setAuthSession({
            token: session.accessToken,
            user: toUserProps(session.user),
          }),
        );
        router.push('/');
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al iniciar sesión.';
        dispatch(setAuthError(message));
        throw err;
      }
    },
    [dispatch, router],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      dispatch(setAuthLoading(true));
      try {
        const session =
          await authContainer.registerUseCase.execute(credentials);
        dispatch(
          setAuthSession({
            token: session.accessToken,
            user: toUserProps(session.user),
          }),
        );
        router.push('/');
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al registrar usuario.';
        dispatch(setAuthError(message));
        throw err;
      }
    },
    [dispatch, router],
  );

  const refreshProfile = useCallback(async () => {
    const profile = await authContainer.getProfileUseCase.execute();
    dispatch(setAuthUser(toUserProps(profile)));
    return profile;
  }, [dispatch]);

  const logout = useCallback(async () => {
    dispatch(setAuthLoading(true));
    try {
      await authContainer.logoutUseCase.execute();
    } finally {
      dispatch(resetAuthState());
      router.push('/login');
    }
  }, [dispatch, router]);

  const clearError = useCallback(() => {
    dispatch(setAuthError(null));
  }, [dispatch]);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.user?.role === 'admin',
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    refreshProfile,
    logout,
    clearError,
  };
}
