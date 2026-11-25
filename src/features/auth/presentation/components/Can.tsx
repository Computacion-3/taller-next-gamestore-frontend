'use client';

import { ReactNode } from 'react';
import { useIsClient } from '@/shared/presentation/hooks/useIsClient';
import { Authority } from '../../domain/entities/Authority';
import { useAuth } from '../hooks/useAuth';

interface CanProps {
  authority: Authority;
  children: ReactNode;
  /** Qué mostrar si el usuario no tiene la authority (por defecto, nada). */
  fallback?: ReactNode;
}

/**
 * Muestra u oculta acciones de la interfaz según las authorities del usuario.
 * En el servidor y durante la hidratación siempre muestra el fallback, porque
 * los permisos solo se conocen en el navegador.
 */
export function Can({ authority, children, fallback = null }: CanProps) {
  const { hasAuthority } = useAuth();
  const isClient = useIsClient();
  return <>{isClient && hasAuthority(authority) ? children : fallback}</>;
}