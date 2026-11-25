'use client';

import { useIsClient } from '@/shared/presentation/hooks/useIsClient';
import { useAuth } from './useAuth';

/**
 * sessionReady = ya se leyó la sesión del navegador (sin romper la hidratación).
 * isAuthenticated solo es true cuando sessionReady también lo es.
 */
export function useSessionReady() {
  const { hydrated, isAuthenticated, user } = useAuth();
  const isClient = useIsClient();
  const sessionReady = isClient && hydrated;

  return {
    sessionReady,
    isAuthenticated: sessionReady && isAuthenticated,
    user,
  };
}