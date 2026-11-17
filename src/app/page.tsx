'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { GameList } from '@/features/games/presentation/components/GameList';
import { useGames } from '@/features/games/presentation/hooks/useGames';

export default function HomePage() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { games, isLoading: gamesLoading, error: gamesError } = useGames();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-white">
              GameStore
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              Clean Architecture
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="text-right text-xs">
                  <p className="font-medium text-white">{user.email}</p>
                  <p className=" uppercase tracking-wider text-emerald-400">
                    {user.role} · ${(user.walletBalance ?? 0).toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={authLoading}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-red-500/60 hover:bg-red-950/60 hover:text-red-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Catálogo de Juegos</h1>
          <p className="mt-1 text-sm text-slate-400">
            {isAuthenticated
              ? 'Explora los títulos disponibles en la tienda.'
              : 'Inicia sesión para consultar el catálogo protegido por JWT.'}
          </p>
        </div>

        <GameList
          games={games}
          isLoading={gamesLoading}
          error={gamesError}
        />
      </main>
    </div>
  );
}
