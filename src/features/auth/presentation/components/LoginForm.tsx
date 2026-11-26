'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useIsClient } from '@/shared/presentation/hooks/useIsClient';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  // Hasta que React hidrata, el formulario no tiene sus eventos: se deshabilita para
  // evitar un envío nativo del navegador que recargaría la página sin iniciar sesión.
  const isClient = useIsClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim()) {
      setValidationError('Por favor ingresa tu correo o identificador.');
      return;
    }
    if (!password) {
      setValidationError('Por favor ingresa tu contraseña.');
      return;
    }

    try {
      await login({ email, password });
    } catch {
      // El hook fachada ya actualiza el estado de error en el store
    }
  };

  const activeError = validationError ?? error;

  return (
    <div className="w-full max-w-md rounded-2xl border border-blue-sky/50 bg-blue-night/80 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Iniciar Sesión
        </h1>
        <p className="mt-1 text-sm text-blue-cloud/85">
          Ingresa a tu cuenta de GameStore
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

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={!isClient} aria-busy={!isClient} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-blue-cloud"
          >
            Correo electrónico o usuario
          </label>
          <input
            id="login-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gamestore.com o ana@gamestore.com"
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-blue-cloud"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3.5 py-2.5 text-sm font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-lg bg-blue-sky px-4 py-2.5 text-sm font-bold text-blue-night shadow transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Verificando credenciales...' : 'Entrar a la tienda'}
        </button>
        </fieldset>
      </form>

      <p className="mt-6 text-center text-sm text-blue-cloud/85">
        ¿No tienes cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-sky transition hover:text-blue-star"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
