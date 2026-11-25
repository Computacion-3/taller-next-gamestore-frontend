'use client';

import { useState } from 'react';
import { Button } from '@/shared/presentation/components/ui/Button';
import { Modal } from '@/shared/presentation/components/ui/Modal';
import { formatPrice } from '@/shared/presentation/utils/format';
import { Game } from '../../../domain/entities/Game';

const DISCOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export interface DiscountDialogProps {
  /** Juego al que se le aplica el descuento; null mantiene el diálogo cerrado. */
  game: Game | null;
  isSubmitting: boolean;
  serverError: string | null;
  onConfirm: (discount: number) => void;
  onClose: () => void;
}

export function DiscountDialog({ game, isSubmitting, serverError, onConfirm, onClose }: DiscountDialogProps) {
  const [value, setValue] = useState(game ? String(game.discount) : '0');
  const [error, setError] = useState<string | null>(null);

  const discount = Number(value);
  const isValid = DISCOUNT_PATTERN.test(value.trim()) && discount >= 0 && discount <= 100;

  const handleChange = (next: string) => {
    setValue(next);
    setError(null);
  };

  const handleConfirm = () => {
    if (!isValid) {
      setError('El descuento debe estar entre 0 y 100 (máximo 2 decimales).');
      return;
    }
    onConfirm(discount);
  };

  return (
    <Modal
      open={game !== null}
      title="Aplicar descuento"
      onClose={onClose}
      isBusy={isSubmitting}
      testId="discount-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText="Aplicando..."
            data-testid="confirm-discount"
          >
            {isValid && discount === 0 ? 'Quitar descuento' : 'Aplicar descuento'}
          </Button>
        </>
      }
    >
      {game && (
        <>
          <p>
            <strong className="text-white">{game.title}</strong> · precio base{' '}
            {formatPrice(game.originalPrice)}
          </p>

          <label htmlFor="discount-range" className="mt-4 block text-xs font-medium text-blue-cloud">
            Descuento (%)
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id="discount-range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={isValid ? discount : 0}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 accent-sky-400"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              aria-label="Descuento exacto en porcentaje"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'discount-error' : undefined}
              className="w-24 rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-2 py-1.5 text-sm font-medium text-blue-night focus:outline-none focus:ring-2 focus:ring-blue-star"
              data-testid="discount-input"
            />
          </div>
          {error && (
            <p id="discount-error" role="alert" className="mt-1 text-xs text-red-300">
              {error}
            </p>
          )}

          <p className="mt-4">
            Precio final:{' '}
            <span className="text-lg font-bold text-emerald-400" data-testid="discount-preview">
              {formatPrice(isValid ? game.priceWithDiscount(discount) : game.price)}
            </span>
          </p>
          <p className="mt-2 text-xs text-blue-cloud/60">
            Los clientes conectados verán el nuevo precio al instante, y se avisará a quienes
            tengan este juego en su wishlist con un precio objetivo alcanzado.
          </p>

          {serverError && (
            <p role="alert" className="mt-4 rounded-md border border-red-400/60 bg-red-500/15 px-3 py-2 text-red-200">
              {serverError}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}