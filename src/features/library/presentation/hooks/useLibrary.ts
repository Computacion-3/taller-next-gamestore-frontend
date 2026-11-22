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
} from '../store/library.slice';

export function useLibrary() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((root) => root.library);

  const library = useMemo(() => items.map(deserializeLibraryItem), [items]);

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

  const fetchUserLibrary = useCallback(async (userId: string) => {
    return libraryContainer.getUserLibraryUseCase.execute(userId);
  }, []);

  return {
    library,
    isLoading,
    error,
    fetchMyLibrary,
    fetchUserLibrary,
  };
}
