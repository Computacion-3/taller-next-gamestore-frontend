'use client';

import { FormEvent, useState } from 'react';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { UserAccount } from '../../domain/entities/UserAccount';
import { useUsers } from '../hooks/useUsers';

interface ProfileEmailFormProps {
  currentEmail: string;
  onUpdated: (user: UserAccount) => void;
}

export function ProfileEmailForm({
  currentEmail,
  onUpdated,
}: ProfileEmailFormProps) {
  const { updateMyEmail } = useUsers();
  const { notify } = useToasts();
  const [email, setEmail] = useState(currentEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const next = email.trim().toLowerCase();
    if (!next || !/^\S+@\S+\.\S+$/.test(next)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (next === currentEmail.toLowerCase()) {
      setError('Ese ya es tu correo actual.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateMyEmail(next);
      setEmail(updated.email);
      onUpdated(updated);
      notify('success', 'Correo actualizado', `Ahora usas ${updated.email}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar el correo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-testid="profile-email-form"
      className="rounded-2xl border border-blue-sky/40 bg-blue-night/80 p-6 backdrop-blur-md"
    >
      <h2 className="text-lg font-bold text-blue-cloud">Cambiar correo</h2>
      <p className="mt-1 text-sm text-blue-cloud/80">
        Es el correo que usas para iniciar sesión.
      </p>

      {error && (
        <p
          role="alert"
          data-testid="profile-email-error"
          className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <label
        htmlFor="profile-email"
        className="mt-4 block text-sm font-medium text-blue-cloud"
      >
        Correo electrónico
      </label>
      <input
        id="profile-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="profile-email-submit"
        className="mt-4 rounded-lg bg-blue-sky px-4 py-2.5 text-sm font-bold text-blue-night transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar correo'}
      </button>
    </form>
  );
}
