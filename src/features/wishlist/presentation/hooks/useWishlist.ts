'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { wishlistContainer } from '../../di/wishlist.container';
import { AddWishlistItemParams } from '../../domain/repositories/WishlistRepository';
import {
  addWishlistRecord,
  deserializeWishlistItem,
  removeWishlistRecord,
  serializeWishlistItem,
  setPriceAlerts,
  setWishlistError,
  setWishlistItems,
  setWishlistLoading,
} from '../store/wishlist.slice';

export function useWishlist() {
  const dispatch = useAppDispatch();
  const { items, alerts, isLoading, error } = useAppSelector(
    (root) => root.wishlist,
  );

  const wishlist = useMemo(() => items.map(deserializeWishlistItem), [items]);

  const fetchWishlist = useCallback(async () => {
    dispatch(setWishlistLoading(true));
    try {
      const [mine, priceAlerts] = await Promise.all([
        wishlistContainer.getMyWishlistUseCase.execute(),
        wishlistContainer.getPriceAlertsUseCase.execute(),
      ]);
      dispatch(setWishlistItems(mine.map(serializeWishlistItem)));
      dispatch(setPriceAlerts(priceAlerts));
    } catch (err) {
      dispatch(
        setWishlistError(
          err instanceof Error ? err.message : 'Error al cargar lista de deseos.',
        ),
      );
    }
  }, [dispatch]);

  const addItem = useCallback(
    async (params: AddWishlistItemParams) => {
      const created =
        await wishlistContainer.addWishlistItemUseCase.execute(params);
      dispatch(addWishlistRecord(serializeWishlistItem(created)));
      return created;
    },
    [dispatch],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await wishlistContainer.removeWishlistItemUseCase.execute(id);
      dispatch(removeWishlistRecord(id));
    },
    [dispatch],
  );

  return {
    wishlist,
    alerts,
    isLoading,
    error,
    fetchWishlist,
    addItem,
    removeItem,
  };
}
