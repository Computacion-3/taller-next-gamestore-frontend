'use client';

import { useEffect } from 'react';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { ToastMessage, ToastType } from '@/shared/store/ui.slice';

const AUTO_DISMISS_MS = 6000;

const STYLES: Record<ToastType, string> = {
  success: 'border-emerald-500/50 bg-emerald-950/95 text-emerald-100',
  info: 'border-sky-500/50 bg-slate-900/95 text-sky-100',
  warning: 'border-amber-500/50 bg-amber-950/95 text-amber-100',
  error: 'border-red-500/50 bg-red-950/95 text-red-100',
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-xl ${STYLES[toast.type]}`}
      data-testid="toast"
    >
      <div>
        <p className="font-semibold">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs opacity-90">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="text-base leading-none opacity-70 transition hover:opacity-100"
      >
        x
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToasts();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}