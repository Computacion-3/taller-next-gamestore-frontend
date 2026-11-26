'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { gamesContainer } from '../../di/games.container';
import {
  deserializeGame,
  serializeGame,
  setGamesError,
  setGamesLoading,
  setSelectedGame,
} from '../store/games.slice';

/** Hook fachada del detalle de un juego (funciona con REST o GraphQL). */
export function useGameDetail() {
  const dispatch = useAppDispatch();
  const { selected, isLoading, error } = useAppSelector((root) => root.games);

  const game = useMemo(() => (selected ? deserializeGame(selected) : null), [selected]);

  const fetchGameById = useCallback(
    async (id: string) => {
      dispatch(setGamesLoading(true));
      try {
        const result = await gamesContainer.getGameByIdUseCase.execute(id);
        dispatch(setSelectedGame(serializeGame(result)));
      } catch (err) {
        dispatch(
          setGamesError(err instanceof Error ? err.message : 'Error al cargar el juego.'),
        );
      }
    },
    [dispatch],
  );

  return { game, isLoading, error, fetchGameById };
}