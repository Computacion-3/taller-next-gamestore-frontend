'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { gamesContainer } from '../../di/games.container';
import { Game } from '../../domain/entities/Game';
import {
  CreateGameParams,
  GetGamesParams,
  UpdateGameParams,
} from '../../domain/repositories/GameRepository';
import {
  addGame,
  deserializeGame,
  removeGame,
  replaceGame,
  serializeGame,
  setGamesError,
  setGamesLoading,
  setGamesPage,
} from '../store/games.slice';

export interface UseGamesOptions {
  /** false = no pide datos (por ejemplo, mientras no hay sesión). */
  enabled?: boolean;
}

export function useGames(
  params: GetGamesParams = {},
  { enabled = true }: UseGamesOptions = {},
) {
  const dispatch = useAppDispatch();
  const { items, pagination, isLoading, error } = useAppSelector(
    (root) => root.games,
  );

  const games = useMemo(() => items.map(deserializeGame), [items]);

  // Se desarman a primitivos: así un objeto literal nuevo en cada render
  // no dispara una petición nueva (evita el bucle infinito).
  const { search, categoryId, page, limit } = params;

  const loadGames = useCallback(
    async (query: GetGamesParams, isCancelled: () => boolean = () => false) => {
      dispatch(setGamesLoading(true));
      try {
        const result = await gamesContainer.getGamesUseCase.execute(query);
        if (!isCancelled()) {
          dispatch(
            setGamesPage({ ...result, items: result.items.map(serializeGame) }),
          );
        }
      } catch (err) {
        if (!isCancelled()) {
          dispatch(
            setGamesError(
              err instanceof Error ? err.message : 'Error inesperado',
            ),
          );
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadGames({ search, categoryId, page, limit }, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [enabled, loadGames, search, categoryId, page, limit]);

  const refetch = useCallback(
    () => loadGames({ search, categoryId, page, limit }),
    [loadGames, search, categoryId, page, limit],
  );

  const getGameById = useCallback(async (id: string): Promise<Game> => {
    return gamesContainer.getGameByIdUseCase.execute(id);
  }, []);

  const createGame = useCallback(
    async (data: CreateGameParams): Promise<Game> => {
      const created = await gamesContainer.createGameUseCase.execute(data);
      dispatch(addGame(serializeGame(created)));
      return created;
    },
    [dispatch],
  );

  const updateGame = useCallback(
    async (id: string, data: UpdateGameParams): Promise<Game> => {
      const updated = await gamesContainer.updateGameUseCase.execute(id, data);
      dispatch(replaceGame(serializeGame(updated)));
      return updated;
    },
    [dispatch],
  );

  const updateDiscount = useCallback(
    async (id: string, discount: number): Promise<Game> => {
      const updated = await gamesContainer.updateGameDiscountUseCase.execute(
        id,
        discount,
      );
      dispatch(replaceGame(serializeGame(updated)));
      return updated;
    },
    [dispatch],
  );

  const deleteGame = useCallback(
    async (id: string): Promise<void> => {
      await gamesContainer.deleteGameUseCase.execute(id);
      dispatch(removeGame(id));
    },
    [dispatch],
  );

  return {
    games,
    pagination,
    isLoading,
    error,
    refetch,
    getGameById,
    createGame,
    updateGame,
    updateDiscount,
    deleteGame,
  };
}