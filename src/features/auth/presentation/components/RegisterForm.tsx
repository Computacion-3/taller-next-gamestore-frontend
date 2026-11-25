'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function RegisterForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register({ email, password });
    } catch {
      // El hook fachada ya actualiza el estado de error en el store
    }
  };

  const activeError = validationError ?? error;

  return (
    <div className="w-full max-w-md rounded-2xl border border-blue-sky/50 bg-blue-night/80 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Crear Cuenta
        </h1>
        <p className="mt-1 text-sm text-blue-cloud/85">
          Únete a GameStore y empieza tu biblioteca digital
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100"
        >
          {activeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-blue-cloud"
          >
            Correo electrónico
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nuevo@gamestore.com"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-blue-cloud"
          >
            Contraseña (mínimo 6 caracteres)
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
          />
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-sm font-medium text-blue-cloud"
          >
            Confirmar contraseña
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-lg bg-blue-sky px-4 py-2.5 text-sm font-bold text-blue-night shadow transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-blue-cloud/85">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-sky transition hover:text-blue-star"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
