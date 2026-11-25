'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { Game } from '@/features/games/domain/entities/Game';
import { useLibrary } from '@/features/library/presentation/hooks/useLibrary';
import { useUsers } from '@/features/users/presentation/hooks/useUsers';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { formatPrice } from '@/shared/presentation/utils/format';
import { usePurchases } from './usePurchases';

/**
 * Hook fachada del flujo de compra: compra, refresca el saldo y la biblioteca,
 * y avisa al usuario. Orquesta los hooks de purchases, users, auth y library.
 */
export function useCheckout() {
  const { user, updateSessionUser } = useAuth();
  const { createPurchase } = usePurchases();
  const { getMyAccount } = useUsers();
  const { fetchMyLibrary } = useLibrary();
  const { notify } = useToasts();
  const [isBuying, setIsBuying] = useState(false);

    const syncWalletBalance = useCallback(async () => {
    try {
      // GET /users/me devuelve el saldo real después de la compra
      const account = await getMyAccount();
      updateSessionUser({
        id: account.id,
        email: account.email,
        role: account.role,
        walletBalance: account.walletBalance,
      });
    } catch {
      // La compra ya quedó hecha; el saldo se corrige en el próximo inicio de sesión
    }
  }, [getMyAccount, updateSessionUser]);

  const buyGame = useCallback(
    async (game: Game): Promise<boolean> => {
      setIsBuying(true);
      try {
        const purchase = await createPurchase({ gameIds: [game.id] });
        await Promise.all([syncWalletBalance(), fetchMyLibrary()]);
        notify(
          'success',
          `¡Compraste ${game.title}!`,
          `Pagaste ${formatPrice(purchase.totalAmount)}. Ya está en tu biblioteca.`,
        );
        return true;
      } catch (err) {
        notify(
          'error',
          'No se pudo completar la compra',
          err instanceof Error ? err.message : undefined,
        );
        return false;
      } finally {
        setIsBuying(false);
      }
    },
    [createPurchase, syncWalletBalance, fetchMyLibrary, notify],
  );

  return {
    walletBalance: user?.walletBalance ?? 0,
    isBuying,
    buyGame,
  };
}