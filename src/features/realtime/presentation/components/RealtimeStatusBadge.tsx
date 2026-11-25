'use client';

import { RealtimeStatus } from '../../domain/entities/RealtimeEvents';
import { useRealtimeStatus } from '../hooks/useRealtime';

const LABELS: Record<RealtimeStatus, string> = {
  connected: 'En vivo',
  connecting: 'Conectando…',
  disconnected: 'Sin conexión',
  error: 'Error en tiempo real',
};

const DOT_COLORS: Record<RealtimeStatus, string> = {
  connected: 'bg-emerald-500',
  connecting: 'bg-amber-400 animate-pulse',
  disconnected: 'bg-slate-400',
  error: 'bg-red-500',
};

export function RealtimeStatusBadge() {
  const { status, detail } = useRealtimeStatus();

  return (
    <span
      className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-night/80"
      title={detail ?? LABELS[status]}
      data-testid="realtime-status"
      data-status={status}
    >
      <span className={`h-2 w-2 rounded-full ${DOT_COLORS[status]}`} aria-hidden="true" />
      {LABELS[status]}
    </span>
  );
}