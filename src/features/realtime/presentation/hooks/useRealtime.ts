'use client';

import { useEffect } from 'react';
import { replaceGame, serializeGame } from '@/features/games/presentation/store/games.slice';
import { upsertPriceAlert } from '@/features/wishlist/presentation/store/wishlist.slice';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { selectAuth } from '@/shared/store/selectors';
import { realtimeContainer } from '../../di/realtime.container';
import {
  markRealtimeEvent,
  setRealtimeStatus,
} from '../store/realtime.slice';

/**
 * Abre la conexión mientras haya sesión y despacha cada evento al store.
 * Se monta UNA sola vez (RealtimeBridge en el layout).
 */
export function useRealtimeConnection(): void {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector(selectAuth);
  const { notify } = useToasts();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    realtimeContainer.connectRealtimeUseCase.execute(token, {
      onStatusChange: (status, detail) =>
        dispatch(setRealtimeStatus({ status, detail })),

      onGameDiscountUpdated: ({ game }) => {
        dispatch(replaceGame(serializeGame(game)));
        dispatch(markRealtimeEvent(new Date().toISOString()));
        notify(
          'info',
          game.hasDiscount
            ? `${game.title} ahora con -${game.discount}%`
            : `${game.title} volvió a su precio normal`,
          `Precio actual: $${game.price.toFixed(2)}`,
        );
      },

      onPriceAlert: (alert) => {
        dispatch(upsertPriceAlert(alert));
        dispatch(markRealtimeEvent(new Date().toISOString()));
        notify(
          'success',
          `${alert.title} alcanzó tu precio objetivo`,
          `Ahora cuesta $${alert.currentPrice.toFixed(2)} (tu objetivo: $${alert.targetPrice.toFixed(2)})`,
        );
      },
    });

    return () => {
      realtimeContainer.disconnectRealtimeUseCase.execute();
      dispatch(setRealtimeStatus({ status: 'disconnected' }));
    };
  }, [dispatch, isAuthenticated, token, notify]);
}

/** Solo lectura del estado de la conexión (para indicadores en la UI). */
export function useRealtimeStatus() {
  const { status, detail, lastEventAt } = useAppSelector((root) => root.realtime);
  return { status, detail, lastEventAt, isConnected: status === 'connected' };
}