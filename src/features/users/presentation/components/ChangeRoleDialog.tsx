'use client';

import { useEffect, useRef } from 'react';
import { getAuthoritiesForRole } from '@/features/auth/domain/entities/Authority';
import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { UserAccount } from '../../domain/entities/UserAccount';
import { RoleBadge } from './RoleBadge';

interface ChangeRoleDialogProps {
  /** Usuario al que se le cambiará el rol; null mantiene el diálogo cerrado. */
  user: UserAccount | null;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: (role: UserRole) => void;
  onClose: () => void;
}

/**
 * Confirmación de cambio de rol. Usa el elemento nativo <dialog>, que ya
 * aporta foco atrapado, cierre con Esc y semántica accesible.
 */
export function ChangeRoleDialog({
  user,
  isSubmitting,
  error,
  onConfirm,
  onClose,
}: ChangeRoleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (user && !dialog.open) dialog.showModal();
    if (!user && dialog.open) dialog.close();
  }, [user]);

  const nextRole: UserRole | null = user
    ? user.role === 'admin'
      ? 'client'
      : 'admin'
    : null;

  const current = user ? getAuthoritiesForRole(user.role) : [];
  const next = nextRole ? getAuthoritiesForRole(nextRole) : [];
  const gained = next.filter((a) => !current.includes(a));
  const lost = current.filter((a) => !next.includes(a));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="change-role-title"
      data-testid="change-role-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !isSubmitting) onClose();
      }}
      className="m-auto w-full max-w-md rounded-2xl border border-blue-sky/40 bg-blue-night p-0 text-blue-cloud shadow-2xl backdrop:bg-black/60"
    >
      {user && nextRole && (
        <div className="p-6">
          <h2 id="change-role-title" className="text-lg font-bold">
            Cambiar rol de usuario
          </h2>
          <p className="mt-2 text-sm text-blue-cloud/80">
            <span className="font-semibold text-blue-cloud">{user.email}</span>{' '}
            pasará de <RoleBadge role={user.role} /> a{' '}
            <RoleBadge role={nextRole} />.
          </p>

          <dl className="mt-4 space-y-2 text-xs">
            {gained.length > 0 && (
              <div>
                <dt className="font-semibold text-blue-water">
                  Obtendrá ({gained.length})
                </dt>
                <dd className="text-blue-cloud/80">{gained.join(', ')}</dd>
              </div>
            )}
            {lost.length > 0 && (
              <div>
                <dt className="font-semibold text-red-300">
                  Perderá ({lost.length})
                </dt>
                <dd className="text-blue-cloud/80">{lost.join(', ')}</dd>
              </div>
            )}
          </dl>

          {error && (
            <p
              role="alert"
              data-testid="change-role-error"
              className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 text-sm font-semibold">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-blue-sky/50 px-4 py-2 transition hover:border-blue-star disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              data-testid="confirm-role-change"
              onClick={() => onConfirm(nextRole)}
              disabled={isSubmitting}
              className="rounded-md bg-blue-star px-4 py-2 text-blue-night transition hover:bg-blue-sky disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar cambio'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
