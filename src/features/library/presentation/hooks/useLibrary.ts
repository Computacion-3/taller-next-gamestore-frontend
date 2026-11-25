'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { libraryContainer } from '../../di/library.container';
import {
  deserializeLibraryItem,
  serializeLibraryItem,
  setLibraryError,
  setLibraryItems,
  setLibraryLoading,
  setUserLibrary,
} from '../store/library.slice';

export function useLibrary() {
  const dispatch = useAppDispatch();
  const { items, userLibrary, isLoading, error } = useAppSelector(
    (root) => root.library,
  );

  const library = useMemo(() => items.map(deserializeLibraryItem), [items]);

  // Ids de los juegos que ya tiene el usuario (para no ofrecer comprarlos otra vez)
  const ownedGameIds = useMemo(
    () => new Set(items.map((item) => item.game.id)),
    [items],
  );

  const selectedUserLibrary = useMemo(
    () =>
      userLibrary
        ? {
            userId: userLibrary.userId,
            items: userLibrary.items.map(deserializeLibraryItem),
          }
        : null,
    [userLibrary],
  );

  const fetchMyLibrary = useCallback(async () => {
    dispatch(setLibraryLoading(true));
    try {
      const result = await libraryContainer.getMyLibraryUseCase.execute();
      dispatch(setLibraryItems(result.map(serializeLibraryItem)));
    } catch (err) {
      dispatch(
        setLibraryError(
          err instanceof Error ? err.message : 'Error al cargar biblioteca.',
        ),
      );
    }
  }, [dispatch]);

  const fetchUserLibrary = useCallback(
    async (userId: string) => {
      dispatch(setLibraryLoading(true));
      try {
        const result = await libraryContainer.getUserLibraryUseCase.execute(userId);
        dispatch(setUserLibrary({ userId, items: result.map(serializeLibraryItem) }));
      } catch (err) {
        dispatch(
          setLibraryError(
            err instanceof Error
              ? err.message
              : 'Error al cargar la biblioteca del usuario.',
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    library,
    ownedGameIds,
    userLibrary: selectedUserLibrary,
    isLoading,
    error,
    fetchMyLibrary,
    fetchUserLibrary,
  };
}