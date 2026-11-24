'use client';

import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { GameList } from '@/features/games/presentation/components/GameList';
import { useGames } from '@/features/games/presentation/hooks/useGames';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { games, isLoading: gamesLoading, error: gamesError } = useGames();

  return (
    <div className="relative flex flex-1 flex-col bg-[url('/images/explore-bg.jpg')] bg-cover bg-center bg-fixed text-slate-100">
      <div className="flex-1 bg-slate-950/40">
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white drop-shadow">
              Catálogo de Juegos
            </h1>
            <p className="mt-1 text-sm text-slate-100 drop-shadow">
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
    </div>
  );
}
