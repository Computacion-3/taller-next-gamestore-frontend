'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { selectAuth } from '@/shared/store/selectors';
import { authContainer } from '../../di/auth.container';
import { Authority } from '../../domain/entities/Authority';
import { AuthUser, AuthUserProps } from '../../domain/entities/AuthUser';
import {
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/repositories/AuthRepository';
import {
  resetAuthState,
  setAuthError,
  setAuthHydrated,
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
  const state = useAppSelector(selectAuth);

  useEffect(() => {
    if (!state.hydrated) {
      const stored = authContainer.getStoredSessionUseCase.execute();
      if (stored) {
        dispatch(
          setAuthSession({
            token: stored.accessToken,
            user: toUserProps(stored.user),
          }),
        );
      } else {
        dispatch(setAuthHydrated(true));
      }
    }
  }, [dispatch, state.hydrated]);

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

  const hasAuthority = useCallback(
    (authority: Authority) => state.authorities.includes(authority),
    [state.authorities],
  );

  return {
    user: state.user,
    token: state.token,
    authorities: state.authorities,
    isAuthenticated: state.isAuthenticated,
    hydrated: state.hydrated,
    isAdmin: state.user?.role === 'admin',
    isLoading: state.isLoading,
    error: state.error,
    hasAuthority,
    login,
    register,
    refreshProfile,
    logout,
    clearError,
  };
}
