'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { AddToWishlistButton } from '@/features/wishlist/presentation/components/AddToWishlistButton';
import { useWishlist } from '@/features/wishlist/presentation/hooks/useWishlist';
import { useLibrary } from '@/features/library/presentation/hooks/useLibrary';
import { BuyGameButton } from '@/features/purchases/presentation/components/BuyGameButton';
import { Pagination } from '@/shared/presentation/components/Pagination';
import { useGames } from '../hooks/useGames';
import { GameList } from './GameList';

const ITEMS_PER_PAGE = 6;

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function GameCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sessionReady, isAuthenticated } = useSessionReady();
  const canLoad = sessionReady && isAuthenticated;

  // La URL es la fuente de verdad: /?search=dragon&page=2
  const search = searchParams.get('search')?.trim() || undefined;
  const page = parsePage(searchParams.get('page'));

  const { games, pagination, isLoading, error } = useGames(
    { search, page, limit: ITEMS_PER_PAGE },
    { enabled: canLoad },
  );
  const { fetchWishlist } = useWishlist();

  const { ownedGameIds, fetchMyLibrary } = useLibrary();

  // Wishlist y biblioteca: para marcar qué juegos ya están guardados o comprados
  useEffect(() => {
    if (canLoad) {
      void fetchWishlist();
      void fetchMyLibrary();
    }
  }, [canLoad, fetchWishlist, fetchMyLibrary]);

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para consultar el catálogo protegido por JWT." />;
  }

  return (
    <>
      {search && (
        <p className="mb-4 text-sm text-slate-100 drop-shadow">
          {pagination.total} resultado(s) para{' '}
          <span className="font-semibold">&quot;{search}&quot;</span> ·{' '}
          <Link href={pathname} className="underline">
            Limpiar búsqueda
          </Link>
        </p>
      )}

      <GameList
        games={games}
        isLoading={isLoading}
        error={error}
        renderActions={(game) => (
          <div className="flex flex-col items-start gap-2">
            <BuyGameButton game={game} />
            {!ownedGameIds.has(game.id) && <AddToWishlistButton game={game} />}
          </div>
        )}
      />

      {!isLoading && !error && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}