'use client';

import { useCallback, useEffect, useState } from 'react';
import { gamesContainer } from '../../di/games.container';
import { Game } from '../../domain/entities/Game';
import { GetGamesParams } from '../../domain/repositories/GameRepository';

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

  useEffect(() => {
    void fetchGames(initialParams);
  }, [fetchGames]);

  return {
    games,
    isLoading,
    error,
    refetch: fetchGames,
  };
}
