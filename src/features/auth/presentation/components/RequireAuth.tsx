'use client';

import { ReactNode } from 'react';
import { Authority } from '../../domain/entities/Authority';
import { useAuth } from '../hooks/useAuth';
import { useSessionReady } from '../hooks/useSessionReady';
import { AccessDenied } from './AccessDenied';

interface RequireAuthProps {
  children: ReactNode;
  /** Si se indica, además de la sesión se exige esta authority. */
  authority?: Authority;
}

/**
 * Protege una vista en el cliente (segunda capa; la primera es proxy.ts).
 * No redirige por su cuenta: así no compite con la navegación del logout.
 *
 * Usa useSessionReady para que, durante la hidratación, renderice lo mismo
 * que el servidor ("Verificando sesión...") aunque otro componente ya haya
 * leído la sesión del navegador.
 */
export function RequireAuth({ children, authority }: RequireAuthProps) {
  const { hasAuthority } = useAuth();
  const { sessionReady, isAuthenticated } = useSessionReady();

  if (!sessionReady) {
    return (
      <p role="status" className="p-8 text-center text-sm text-slate-100">
        Verificando sesión...
      </p>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied variant="unauthenticated" />;
  }

  if (authority && !hasAuthority(authority)) {
    return <AccessDenied variant="forbidden" />;
  }

  return <>{children}</>;
}