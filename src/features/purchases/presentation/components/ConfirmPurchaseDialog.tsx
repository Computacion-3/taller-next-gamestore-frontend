import { Game } from '@/features/games/domain/entities/Game';
import { Button } from '@/shared/presentation/components/ui/Button';
import { Modal } from '@/shared/presentation/components/ui/Modal';
import { formatPrice } from '@/shared/presentation/utils/format';

export interface ConfirmPurchaseDialogProps {
  /** Juego a comprar; null mantiene el diálogo cerrado. */
  game: Game | null;
  walletBalance: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmPurchaseDialog({
  game,
  walletBalance,
  isSubmitting,
  onConfirm,
  onClose,
}: ConfirmPurchaseDialogProps) {
  const price = game?.price ?? 0;
  const balanceAfter = Math.round((walletBalance - price) * 100) / 100;
  const canAfford = balanceAfter >= 0;

  return (
    <Modal
      open={game !== null}
      title="Confirmar compra"
      onClose={onClose}
      isBusy={isSubmitting}
      testId="confirm-purchase-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canAfford}
            isLoading={isSubmitting}
            loadingText="Comprando..."
            data-testid="confirm-purchase"
          >
            Pagar {formatPrice(price)}
          </Button>
        </>
      }
    >
      {game && (
        <>
          <p>
            Vas a comprar <strong className="text-white">{game.title}</strong>.
          </p>
          <dl className="mt-4 space-y-1">
            <div className="flex justify-between">
              <dt className="text-blue-cloud/70">Precio</dt>
              <dd className="font-semibold text-white">{formatPrice(price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-blue-cloud/70">Saldo actual</dt>
              <dd>{formatPrice(walletBalance)}</dd>
            </div>
            <div className="flex justify-between border-t border-blue-sky/20 pt-1">
              <dt className="text-blue-cloud/70">Saldo después</dt>
              <dd className={`font-bold ${canAfford ? 'text-emerald-400' : 'text-red-300'}`}>
                {formatPrice(balanceAfter)}
              </dd>
            </div>
          </dl>
          {!canAfford && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200"
            >
              No tienes saldo suficiente para esta compra.
            </p>
          )}
        </>
      )}
    </Modal>
  );
}