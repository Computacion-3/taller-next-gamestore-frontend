'use client';

import { useCallback, useEffect, useState } from 'react';
import { gamesContainer } from '../../di/games.container';
import { Game } from '../../domain/entities/Game';
import {
  CreateGameParams,
  GetGamesParams,
  UpdateGameParams,
} from '../../domain/repositories/GameRepository';

export function useGames(initialParams?: GetGamesParams) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async (params?: GetGamesParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await gamesContainer.getGamesUseCase.execute(params);
      setGames(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGameById = useCallback(async (id: string): Promise<Game> => {
    return gamesContainer.getGameByIdUseCase.execute(id);
  }, []);

  const createGame = useCallback(
    async (params: CreateGameParams): Promise<Game> => {
      const created = await gamesContainer.createGameUseCase.execute(params);
      setGames((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const updateGame = useCallback(
    async (id: string, params: UpdateGameParams): Promise<Game> => {
      const updated = await gamesContainer.updateGameUseCase.execute(id, params);
      setGames((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    [],
  );

  const updateDiscount = useCallback(
    async (id: string, discount: number): Promise<Game> => {
      const updated = await gamesContainer.updateGameDiscountUseCase.execute(
        id,
        discount,
      );
      setGames((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    [],
  );

  const deleteGame = useCallback(async (id: string): Promise<void> => {
    await gamesContainer.deleteGameUseCase.execute(id);
    setGames((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result =
          await gamesContainer.getGamesUseCase.execute(initialParams);
        if (!cancelled) {
          setGames(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error inesperado');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialParams]);

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
