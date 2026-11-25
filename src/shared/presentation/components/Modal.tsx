'use client';

import { MouseEvent, ReactNode, useEffect, useId, useRef } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Zona inferior para acciones (botones). */
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

/**
 * Modal accesible basado en el elemento nativo <dialog>:
 * el navegador gestiona el foco, el bloqueo del fondo y la tecla Esc.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    // Solo el <dialog> en sí es el objetivo cuando se hace clic sobre el backdrop
    if (closeOnBackdrop && event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-cy="modal"
      className={`m-auto w-[calc(100%-2rem)] ${SIZE_CLASSES[size]} rounded-2xl border border-blue-sky/40 bg-blue-night/95 p-0 text-blue-cloud shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm`}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-blue-sky/30 px-6 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-bold text-white">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-0.5 text-sm text-blue-cloud/70">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              data-cy="modal-close"
              className="rounded-lg p-1.5 text-blue-cloud/70 transition hover:bg-blue-sky/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-star"
            >
              ✕
            </button>
          </header>

          <div className="overflow-y-auto px-6 py-5">{children}</div>

          {footer && (
            <footer className="flex flex-wrap justify-end gap-2 border-t border-blue-sky/30 px-6 py-4">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}
