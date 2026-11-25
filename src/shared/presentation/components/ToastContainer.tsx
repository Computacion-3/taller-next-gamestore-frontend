'use client';

import { useEffect } from 'react';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import type { ToastMessage, ToastType } from '@/shared/store/ui.slice';

const AUTO_DISMISS_MS = 5000;

const TOAST_STYLES: Record<
  ToastType,
  { icon: string; accent: string; label: string }
> = {
  success: { icon: '✓', accent: 'bg-emerald-400 text-blue-night', label: 'Éxito' },
  error: { icon: '✕', accent: 'bg-red-400 text-blue-night', label: 'Error' },
  warning: { icon: '!', accent: 'bg-amber-300 text-blue-night', label: 'Aviso' },
  info: { icon: 'i', accent: 'bg-blue-star text-blue-night', label: 'Información' },
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const style = TOAST_STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      data-cy="toast"
      data-cy-type={toast.type}
      className="pointer-events-auto flex items-start gap-3 rounded-xl border border-blue-sky/40 bg-blue-night/90 p-4 text-blue-cloud shadow-2xl backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.accent}`}
      >
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          <span className="sr-only">{style.label}: </span>
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 break-words text-xs text-blue-cloud/75">
            {toast.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        data-cy="toast-close"
        className="rounded p-1 text-blue-cloud/60 transition hover:bg-blue-sky/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-star"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Contenedor global de notificaciones. Se monta una sola vez en el layout raíz
 * y se alimenta del slice `ui` mediante el hook fachada `useToasts`.
 */
export function ToastContainer() {
  const { toasts, dismiss } = useToasts();

  return (
    <div
      aria-live="polite"
      data-cy="toast-container"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
