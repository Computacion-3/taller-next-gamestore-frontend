'use client';

import { useEffect } from 'react';
import { useLibrary } from '@/features/library/presentation/hooks/useLibrary';
import { useWishlist } from '@/features/wishlist/presentation/hooks/useWishlist';

/**
 * Carga la wishlist y la biblioteca del usuario para que las tarjetas
 * sepan qué juegos ya compró o guardó.
 */
export function useMyCollections(enabled: boolean): void {
  const { fetchWishlist } = useWishlist();
  const { fetchMyLibrary } = useLibrary();

  useEffect(() => {
    if (!enabled) return;
    void fetchWishlist();
    void fetchMyLibrary();
  }, [enabled, fetchWishlist, fetchMyLibrary]);
}