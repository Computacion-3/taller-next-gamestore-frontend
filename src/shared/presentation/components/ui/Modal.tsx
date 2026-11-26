'use client';

import { ReactNode, useEffect, useId, useRef } from 'react';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Mientras es true no se puede cerrar (por ejemplo, durante una petición). */
  isBusy?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
  /** md para confirmaciones, lg para formularios. */
  size?: 'md' | 'lg';
}

/**
 * Modal accesible sobre el <dialog> nativo (mismo patrón que ChangeRoleDialog):
 * foco atrapado, cierre con Esc y clic en el fondo.
 */
export function Modal({ open, title, onClose, isBusy = false, children, footer, testId, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-testid={testId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isBusy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !isBusy) onClose();
      }}
      className={`m-auto max-h-[90vh] w-full overflow-y-auto ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} rounded-2xl border border-blue-sky/40 bg-blue-night p-0 text-blue-cloud shadow-2xl backdrop:bg-black/60`}
    >
      {open && (
        <div className="p-6">
          <h2 id={titleId} className="text-lg font-bold text-white">
            {title}
          </h2>
          <div className="mt-3 text-sm">{children}</div>
          {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}