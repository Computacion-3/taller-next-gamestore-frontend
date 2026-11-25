'use client';

import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación para acciones destructivas (eliminar juego, categoría…). */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} data-cy="confirm-cancel">
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={onConfirm}
            data-cy="confirm-accept"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-blue-cloud/85">{message}</p>
    </Modal>
  );
}
