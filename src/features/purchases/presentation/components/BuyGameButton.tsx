'use client';

import { useState } from 'react';
import { Game } from '@/features/games/domain/entities/Game';
import { useLibrary } from '@/features/library/presentation/hooks/useLibrary';
import { Button } from '@/shared/presentation/components/ui/Button';
import { formatPrice } from '@/shared/presentation/utils/format';
import { useCheckout } from '../hooks/useCheckout';
import { ConfirmPurchaseDialog } from './ConfirmPurchaseDialog';

export function BuyGameButton({ game }: { game: Game }) {
  const { ownedGameIds } = useLibrary();
  const { walletBalance, isBuying, buyGame } = useCheckout();
  const [selected, setSelected] = useState<Game | null>(null);

  if (ownedGameIds.has(game.id)) {
    return <span className="text-xs font-semibold text-emerald-400">✓ En tu biblioteca</span>;
  }

  const handleConfirm = async () => {
    if (!selected) return;
    const ok = await buyGame(selected);
    if (ok) setSelected(null);
  };

  return (
    <>
      <Button size="sm" onClick={() => setSelected(game)} data-testid={`buy-${game.id}`}>
        Comprar · {formatPrice(game.price)}
      </Button>
      <ConfirmPurchaseDialog
        game={selected}
        walletBalance={walletBalance}
        isSubmitting={isBuying}
        onConfirm={handleConfirm}
        onClose={() => setSelected(null)}
      />
    </>
  );
}