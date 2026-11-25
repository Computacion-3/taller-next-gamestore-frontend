'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * false en el servidor y durante la hidratación; true después.
 * Sirve para mostrar contenido que depende del navegador (localStorage, sesión)
 * sin romper la hidratación.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // valor en el cliente
    () => false, // valor en el servidor y al hidratar
  );
}