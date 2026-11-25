'use client';

import { useEffect, useState } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { WishlistItem } from '../../domain/entities/WishlistItem';
import { useWishlist } from '../hooks/useWishlist';
import { PriceAlertsBanner } from './PriceAlertsBanner';
import { WishlistItemCard } from './WishlistItemCard';

export function WishlistView() {
  const { sessionReady, isAuthenticated } = useSessionReady();
  const { wishlist, alerts, isLoading, error, fetchWishlist, removeItem } = useWishlist();
  const { notify } = useToasts();
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      void fetchWishlist();
    }
  }, [sessionReady, isAuthenticated, fetchWishlist]);

  const handleRemove = async (item: WishlistItem) => {
    setRemovingId(item.id);
    try {
      await removeItem(item.id);
      notify('info', `${item.game.title} se quitó de tu wishlist`);
    } catch (err) {
      notify(
        'error',
        'No se pudo quitar de la wishlist',
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver tu lista de deseos." />;
  }
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
        {error}
      </p>
    );
  }
  if (isLoading && wishlist.length === 0) {
    return <p className="text-sm text-slate-100">Cargando tu wishlist...</p>;
  }

  return (
    <>
      <PriceAlertsBanner alerts={alerts} />

      {wishlist.length === 0 ? (
        <EmptyState
          title="Tu wishlist está vacía"
          description="Agrega juegos desde el catálogo y define un precio objetivo para recibir alertas en tiempo real."
          actionHref="/"
          actionLabel="Explorar catálogo"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              isRemoving={removingId === item.id}
            />
          ))}
        </div>
      )}
    </>
  );
}