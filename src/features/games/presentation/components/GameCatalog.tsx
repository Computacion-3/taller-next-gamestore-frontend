'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
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
  const { isAuthenticated, hydrated } = useAuth();

  // La URL es la fuente de verdad: /?search=dragon&page=2
  const search = searchParams.get('search')?.trim() || undefined;
  const page = parsePage(searchParams.get('page'));

  const { games, pagination, isLoading, error } = useGames(
    { search, page, limit: ITEMS_PER_PAGE },
    { enabled: hydrated && isAuthenticated },
  );

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hydrated) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-slate-100 drop-shadow">
        <Link href="/login" className="font-semibold underline">
          Inicia sesión
        </Link>{' '}
        para consultar el catálogo protegido por JWT.
      </p>
    );
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

      <GameList games={games} isLoading={isLoading} error={error} />

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