'use client';

import { useRealtimeConnection } from '../hooks/useRealtime';

/** Componente sin UI: mantiene viva la conexión en tiempo real mientras haya sesión. */
export function RealtimeBridge() {
  useRealtimeConnection();
  return null;
}