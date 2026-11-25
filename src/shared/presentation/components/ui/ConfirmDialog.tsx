'use client';

import { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  variant?: 'primary' | 'danger';
  isSubmitting?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  testId?: string;
}

/** Confirmación genérica (eliminar, retirar, etc.). */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  variant = 'primary',
  isSubmitting = false,
  error,
  onConfirm,
  onClose,
  testId,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      isBusy={isSubmitting}
      testId={testId}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText="Procesando..."
            data-testid={testId ? `${testId}-confirm` : undefined}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200">
          {error}
        </p>
      )}
    </Modal>
  );
}