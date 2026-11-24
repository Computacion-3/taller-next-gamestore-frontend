'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { GameList } from '@/features/games/presentation/components/GameList';
import { useGames } from '@/features/games/presentation/hooks/useGames';
import { Pagination } from '@/shared/presentation/components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { games, isLoading: gamesLoading, error: gamesError } = useGames();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAuthenticated = mounted && isAuthenticated;

  const totalPages = Math.max(1, Math.ceil(games.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleGames = games.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white drop-shadow">
          Catálogo de Juegos
        </h1>
        <p className="mt-1 text-sm text-slate-100 drop-shadow">
          {showAuthenticated
            ? 'Explora los títulos disponibles en la tienda.'
            : 'Inicia sesión para consultar el catálogo protegido por JWT.'}
        </p>
      </div>

      <GameList
        games={visibleGames}
        isLoading={gamesLoading}
        error={gamesError}
      />

      {!gamesLoading && !gamesError && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
