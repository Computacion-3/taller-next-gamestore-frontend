'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
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
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Iniciar Sesión
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Ingresa a tu cuenta de GameStore
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/40 bg-red-950/60 px-4 py-3 text-sm text-red-200"
        >
          {activeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-slate-300"
          >
            Correo electrónico o usuario
          </label>
          <input
            id="login-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@store.com o client@store.com"
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-slate-300"
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
            className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Verificando credenciales...' : 'Entrar a la tienda'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
