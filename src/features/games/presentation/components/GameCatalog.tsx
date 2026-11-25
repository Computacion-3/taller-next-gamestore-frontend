'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { useCategories } from '@/features/categories/presentation/hooks/useCategories';
import { Pagination } from '@/shared/presentation/components/Pagination';
import { useGames } from '../hooks/useGames';
import { useMyCollections } from '../hooks/useMyCollections';
import { CatalogFilters } from './CatalogFilters';
import { GameActions } from './GameActions';
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

  // La URL es la fuente de verdad: /?search=dragon&categoryId=<uuid>&page=2
  const search = searchParams.get('search')?.trim() ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const page = parsePage(searchParams.get('page'));

  const { games, pagination, isLoading, error } = useGames(
    {
      search: search || undefined,
      categoryId: categoryId || undefined,
      page,
      limit: ITEMS_PER_PAGE,
    },
    { enabled: canLoad },
  );
  const { categories, fetchCategories } = useCategories();
  useMyCollections(canLoad);

  useEffect(() => {
    if (canLoad) void fetchCategories();
  }, [canLoad, fetchCategories]);

  /** Cambia los filtros en la URL. Al filtrar se vuelve a la página 1. */
  const updateFilters = (changes: Record<string, string>) => {
    // Se lee la URL actual (y no la del último render) por si cambió durante el debounce
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete('page');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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

  const hasFilters = Boolean(search || categoryId);

  return (
    <>
      <CatalogFilters
        search={search}
        categoryId={categoryId}
        categories={categories}
        onSearchChange={(value) => updateFilters({ search: value })}
        onCategoryChange={(value) => updateFilters({ categoryId: value })}
        onClear={() => router.replace(pathname, { scroll: false })}
      />

      {hasFilters && !isLoading && !error && (
        <p className="mb-4 text-sm text-slate-100 drop-shadow" aria-live="polite">
          {pagination.total} resultado(s)
        </p>
      )}

      <GameList
        games={games}
        isLoading={isLoading}
        error={error}
        renderActions={(game) => <GameActions game={game} />}
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