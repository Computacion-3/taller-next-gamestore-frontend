'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { useCategories } from '@/features/categories/presentation/hooks/useCategories';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { useGameDetail } from '../hooks/useGameDetail';
import { useMyCollections } from '../hooks/useMyCollections';
import { GameActions } from './GameActions';
import { GameDetail } from './GameDetail';

export function GameDetailView() {
  const { id } = useParams<{ id: string }>();
  const { sessionReady, isAuthenticated } = useSessionReady();
  const canLoad = sessionReady && isAuthenticated;
  const { game, isLoading, error, fetchGameById } = useGameDetail();
  const { gameCategories, fetchGameCategories } = useCategories();
  useMyCollections(canLoad);

  useEffect(() => {
    if (canLoad && id) {
      void fetchGameById(id);
      void fetchGameCategories(id);
    }
  }, [canLoad, id, fetchGameById, fetchGameCategories]);

  const backLink = (
    <Link href="/" className={buttonClasses('secondary', 'sm')}>
      ← Volver al catálogo
    </Link>
  );

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver el detalle del juego." />;
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
  if (isLoading || !game || game.id !== id) {
    return <p className="text-sm text-slate-100">Cargando juego...</p>;
  }

  const categories = gameCategories?.gameId === id ? gameCategories.items : [];

  return (
    <div className="space-y-4">
      {backLink}
      <GameDetail game={game} categories={categories} actions={<GameActions game={game} />} />
    </div>
  );
}