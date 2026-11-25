'use client';

import { useLibrary } from '@/features/library/presentation/hooks/useLibrary';
import { BuyGameButton } from '@/features/purchases/presentation/components/BuyGameButton';
import { AddToWishlistButton } from '@/features/wishlist/presentation/components/AddToWishlistButton';
import { Game } from '../../domain/entities/Game';

/** Acciones de compra y wishlist de una tarjeta de juego. */
export function GameActions({ game }: { game: Game }) {
  const { ownedGameIds } = useLibrary();

  return (
    <div className="flex flex-col items-start gap-2">
      <BuyGameButton game={game} />
      {!ownedGameIds.has(game.id) && <AddToWishlistButton game={game} />}
    </div>
  );
}