'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { GameActions } from '@/features/games/presentation/components/GameActions';
import { GameList } from '@/features/games/presentation/components/GameList';
import { useMyCollections } from '@/features/games/presentation/hooks/useMyCollections';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';
import { useCategories } from '../hooks/useCategories';

export function CategoryDetailView() {
  const { id } = useParams<{ id: string }>();
  const { sessionReady, isAuthenticated } = useSessionReady();
  const canLoad = sessionReady && isAuthenticated;
  const { categoryDetail, isLoading, error, fetchCategoryDetail } = useCategories();
  useMyCollections(canLoad);

  useEffect(() => {
    if (canLoad && id) void fetchCategoryDetail(id);
  }, [canLoad, id, fetchCategoryDetail]);

  const backLink = (
    <Link href="/categories" className={buttonClasses('secondary', 'sm')}>
      ← Todas las categorías
    </Link>
  );

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver los juegos de esta categoría." />;
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
        {backLink}
      </div>
    );
  }
  if (isLoading || !categoryDetail || categoryDetail.category.id !== id) {
    return <p className="text-sm text-slate-100">Cargando categoría...</p>;
  }

  const { category, games } = categoryDetail;

  return (
    <>
      <PageHeader title={category.name} subtitle={category.description ?? undefined}>
        {backLink}
      </PageHeader>

      <p className="mb-4 text-sm text-slate-100 drop-shadow">
        {games.length} {games.length === 1 ? 'juego' : 'juegos'} en esta categoría
      </p>

      {games.length === 0 ? (
        <EmptyState
          title="Esta categoría todavía no tiene juegos"
          actionHref="/"
          actionLabel="Ir al catálogo"
        />
      ) : (
        <GameList games={games} renderActions={(game) => <GameActions game={game} />} />
      )}
    </>
  );
}