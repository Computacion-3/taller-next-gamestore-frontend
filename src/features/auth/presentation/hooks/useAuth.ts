'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { HttpError } from '@/shared/infrastructure/http/httpClient';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
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

/**
 * Lee ?redirect= tras el guard de rutas. Solo acepta rutas internas
 * (evita open-redirect hacia dominios externos).
 */
function getSafeRedirect(): string {
  if (typeof window === 'undefined') return '/';
  const target = new URLSearchParams(window.location.search).get('redirect');
  if (target && target.startsWith('/') && !target.startsWith('//')) {
    return target;
  }
  return '/';
}

/**
 * Al abrir la app se confirma con el backend (GET /auth/profile) que el token
 * guardado sigue siendo válido. Solo se hace una vez por carga de página.
 * Únicamente un 401 cierra la sesión: un error de red no debe sacar al usuario.
 */
let sessionVerificationStarted = false;

async function verifyStoredSession(onInvalid: () => void): Promise<void> {
  if (sessionVerificationStarted) return;
  sessionVerificationStarted = true;
  try {
    await authContainer.getProfileUseCase.execute();
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) {
      onInvalid();
    }
  }
}

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
  const { notify } = useToasts();

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
        void verifyStoredSession(() => {
          // El token ya no sirve en el backend: se limpia la sesión local.
          void authContainer.logoutUseCase
            .execute()
            .catch(() => undefined)
            .finally(() => {
              dispatch(resetAuthState());
              notify(
                'info',
                'Sesión expirada',
                'Vuelve a iniciar sesión para continuar.',
              );
            });
        });
      } else {
        dispatch(setAuthHydrated(true));
      }
    }
  }, [dispatch, notify, state.hydrated]);

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
        notify('success', 'Sesión iniciada', `Bienvenido, ${session.user.email}`);
        router.push(getSafeRedirect());
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al iniciar sesión.';
        notify('error', 'No se pudo iniciar sesión', message);
        dispatch(setAuthError(message));
        throw err;
      }
    },
    [dispatch, router, notify],
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
        notify('success', 'Cuenta creada', `Bienvenido, ${session.user.email}`);
        router.push('/');
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al registrar usuario.';
        notify('error', 'No se pudo registrar', message);
        dispatch(setAuthError(message));
        throw err;
      }
    },
    [dispatch, router, notify],
  );

  const refreshProfile = useCallback(async () => {
    const profile = await authContainer.getProfileUseCase.execute();
    dispatch(setAuthUser(toUserProps(profile)));
    return profile;
  }, [dispatch]);

  /** Actualiza el usuario en el store y en el almacenamiento (p. ej. tras cambiar el correo). */
  const updateSessionUser = useCallback(
    (props: AuthUserProps) => {
      authContainer.saveSessionUserUseCase.execute(new AuthUser(props));
      dispatch(setAuthUser(props));
    },
    [dispatch],
  );


  const logout = useCallback(async () => {
    dispatch(setAuthLoading(true));
    try {
      await authContainer.logoutUseCase.execute();
    } finally {
      // resetAuthState limpia todo el store (incluidos los toasts),
      // por eso la notificación se emite después del reseteo.
      dispatch(resetAuthState());
      notify('info', 'Sesión cerrada', 'Has salido de tu cuenta.');
      router.push('/');
    }
  }, [dispatch, router, notify]);

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
    updateSessionUser,
    logout,
    clearError,
  };
}
