'use client';

import { FormEvent, useState } from 'react';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { useUsers } from '../hooks/useUsers';

// Mismas reglas que el backend (ChangePasswordDto).
function validateNewPassword(value: string): string | null {
  if (value.length < 8) return 'La nueva contraseña debe tener al menos 8 caracteres.';
  if (value.length > 72) return 'La contraseña no puede superar 72 caracteres.';
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(value)) {
    return 'La nueva contraseña debe incluir una minúscula, una mayúscula y un número.';
  }
  return null;
}

const INPUT_CLASS =
  'mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star';

export function ProfilePasswordForm() {
  const { changeMyPassword } = useUsers();
  const { notify } = useToasts();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Ingresa tu contraseña actual.');
      return;
    }
    const invalid = validateNewPassword(newPassword);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (newPassword === currentPassword) {
      setError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notify(
        'success',
        'Contraseña actualizada',
        'Úsala la próxima vez que inicies sesión.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar la contraseña.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-testid="profile-password-form"
      className="rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-6 backdrop-blur-md"
    >
      <h2 className="text-lg font-bold text-blue-cloud">Cambiar contraseña</h2>
      <p className="mt-1 text-sm text-blue-cloud/80">
        Entre 8 y 72 caracteres, con una minúscula, una mayúscula y un número.
      </p>

      {error && (
        <p
          role="alert"
          data-testid="profile-password-error"
          className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <label
        htmlFor="profile-current-password"
        className="mt-4 block text-sm font-medium text-blue-cloud"
      >
        Contraseña actual
      </label>
      <input
        id="profile-current-password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
        className={INPUT_CLASS}
      />

      <label
        htmlFor="profile-new-password"
        className="mt-4 block text-sm font-medium text-blue-cloud"
      >
        Nueva contraseña
      </label>
      <input
        id="profile-new-password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        className={INPUT_CLASS}
      />

      <label
        htmlFor="profile-confirm-password"
        className="mt-4 block text-sm font-medium text-blue-cloud"
      >
        Confirmar nueva contraseña
      </label>
      <input
        id="profile-confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        className={INPUT_CLASS}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="profile-password-submit"
        className="mt-4 rounded-lg bg-blue-sky px-4 py-2.5 text-sm font-bold text-blue-night transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}
