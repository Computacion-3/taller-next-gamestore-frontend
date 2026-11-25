'use client';

import { ReactNode } from 'react';
import { Authority } from '../../domain/entities/Authority';
import { useAuth } from '../hooks/useAuth';

interface CanProps {
  authority: Authority;
  children: ReactNode;
  /** Qué mostrar si el usuario no tiene la authority (por defecto, nada). */
  fallback?: ReactNode;
}

/** Muestra u oculta acciones de la interfaz según las authorities del usuario. */
export function Can({ authority, children, fallback = null }: CanProps) {
  const { hasAuthority } = useAuth();
  return <>{hasAuthority(authority) ? children : fallback}</>;
}
