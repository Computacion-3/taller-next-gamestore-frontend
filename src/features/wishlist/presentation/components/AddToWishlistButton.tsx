'use client';

import { FormEvent, useState } from 'react';
import { Game } from '@/features/games/domain/entities/Game';
import { Button } from '@/shared/presentation/components/ui/Button';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { formatPrice } from '@/shared/presentation/utils/format';
import { useWishlist } from '../hooks/useWishlist';

export function AddToWishlistButton({ game }: { game: Game }) {
  const { addItem, wishlistGameIds } = useWishlist();
  const { notify } = useToasts();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (wishlistGameIds.has(game.id)) {
    return <span className="text-xs font-semibold text-blue-sky">♥ En tu wishlist</span>;
  }

  const close = () => {
    setIsOpen(false);
    setTargetPrice('');
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    let target: number | undefined;
    const trimmed = targetPrice.trim();
    if (trimmed) {
      target = Number(trimmed);
      if (!Number.isFinite(target) || target < 0) {
        setError('Ingresa un precio válido.');
        return;
      }
      if (target >= game.price) {
        setError(`Debe ser menor al precio actual (${formatPrice(game.price)}).`);
        return;
      }
    }

    setIsSaving(true);
    try {
      await addItem({ gameId: game.id, ...(target !== undefined && { targetPrice: target }) });
      notify(
        'success',
        `${game.title} agregado a tu wishlist`,
        target !== undefined
          ? `Te avisaremos cuando cueste ${formatPrice(target)} o menos.`
          : undefined,
      );
      close();
    } catch (err) {
      notify(
        'error',
        'No se pudo agregar a la wishlist',
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        ♡ Agregar a wishlist
      </Button>
    );
  }

  const inputId = `target-price-${game.id}`;
  const errorId = `target-price-error-${game.id}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <label htmlFor={inputId} className="block text-xs font-medium text-blue-cloud">
        Precio objetivo (opcional)
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder={`Menor a ${game.price.toFixed(2)}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full rounded-lg border border-blue-sky/40 bg-blue-cloud/95 px-3 py-1.5 text-xs font-medium text-blue-night placeholder-blue-night/45 focus:border-blue-star focus:outline-none focus:ring-2 focus:ring-blue-star"
        />
        <Button type="submit" size="sm" isLoading={isSaving} loadingText="...">
          Guardar
        </Button>
        <Button size="sm" variant="secondary" onClick={close}>
          Cancelar
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}