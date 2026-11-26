'use client';

import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useLibrary } from '../hooks/useLibrary';
import { LibraryGrid } from './LibraryGrid';

export function LibraryView() {
  const { sessionReady, isAuthenticated } = useSessionReady();
  const { library, isLoading, error, fetchMyLibrary } = useLibrary();

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      void fetchMyLibrary();
    }
  }, [sessionReady, isAuthenticated, fetchMyLibrary]);

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver tu biblioteca." />;
  }
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
        {error}
      </p>
    );
  }
  if (isLoading && library.length === 0) {
    return <p className="text-sm text-slate-100">Cargando tu biblioteca...</p>;
  }
  if (library.length === 0) {
    return (
      <EmptyState
        title="Tu biblioteca está vacía"
        description="Los juegos que compres aparecerán aquí."
        actionHref="/"
        actionLabel="Ir a la tienda"
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-slate-100 drop-shadow">
        {library.length} {library.length === 1 ? 'juego' : 'juegos'} en tu biblioteca
      </p>
      <LibraryGrid items={library} />
    </>
  );
}