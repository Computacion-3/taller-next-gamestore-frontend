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
  setGames,
  setGamesError,
  setGamesLoading,
} from '../store/games.slice';

export function useGames(initialParams?: GetGamesParams) {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((root) => root.games);

  const games = useMemo(() => items.map(deserializeGame), [items]);

  const fetchGames = useCallback(
    async (params?: GetGamesParams) => {
      dispatch(setGamesLoading(true));
      try {
        const result = await gamesContainer.getGamesUseCase.execute(params);
        dispatch(setGames(result.map(serializeGame)));
      } catch (err) {
        dispatch(
          setGamesError(
            err instanceof Error ? err.message : 'Error inesperado',
          ),
        );
      }
    },
    [dispatch],
  );

  const getGameById = useCallback(async (id: string): Promise<Game> => {
    return gamesContainer.getGameByIdUseCase.execute(id);
  }, []);

  const createGame = useCallback(
    async (params: CreateGameParams): Promise<Game> => {
      const created = await gamesContainer.createGameUseCase.execute(params);
      dispatch(addGame(serializeGame(created)));
      return created;
    },
    [dispatch],
  );

  const updateGame = useCallback(
    async (id: string, params: UpdateGameParams): Promise<Game> => {
      const updated = await gamesContainer.updateGameUseCase.execute(id, params);
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

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      dispatch(setGamesLoading(true));
      try {
        const result =
          await gamesContainer.getGamesUseCase.execute(initialParams);
        if (!cancelled) {
          dispatch(setGames(result.map(serializeGame)));
        }
      } catch (err) {
        if (!cancelled) {
          dispatch(
            setGamesError(
              err instanceof Error ? err.message : 'Error inesperado',
            ),
          );
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, initialParams]);

  return {
    games,
    isLoading,
    error,
    refetch: fetchGames,
    getGameById,
    createGame,
    updateGame,
    updateDiscount,
    deleteGame,
  };
}
