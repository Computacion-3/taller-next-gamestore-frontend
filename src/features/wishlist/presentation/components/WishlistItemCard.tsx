import { Button } from '@/shared/presentation/components/ui/Button';
import { Card } from '@/shared/presentation/components/ui/Card';
import { formatPrice } from '@/shared/presentation/utils/format';
import { WishlistItem } from '../../domain/entities/WishlistItem';

export interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
  isRemoving?: boolean;
}

export function WishlistItemCard({ item, onRemove, isRemoving = false }: WishlistItemCardProps) {
  const { game } = item;

  return (
    <Card className="flex flex-col gap-3" data-testid="wishlist-item">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{game.title}</h3>
          {game.developer && <p className="text-xs text-blue-cloud/70">{game.developer}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {item.hasReachedTarget && (
            <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              ¡Precio alcanzado!
            </span>
          )}
          {game.isActive === false && (
            <span className="rounded bg-slate-600 px-2 py-0.5 text-xs font-bold text-white">
              No disponible
            </span>
          )}
        </div>
      </div>

      {game.description && (
        <p className="line-clamp-2 text-sm text-blue-cloud/85">{game.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-blue-cloud/60">Precio actual</dt>
          <dd className="font-bold text-emerald-400">{formatPrice(game.currentPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-blue-cloud/60">Precio objetivo</dt>
          <dd className="font-semibold text-white">
            {item.targetPrice !== null ? formatPrice(item.targetPrice) : 'Sin objetivo'}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex justify-end">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(item)}
          isLoading={isRemoving}
          loadingText="Quitando..."
        >
          Quitar
        </Button>
      </div>
    </Card>
  );
}