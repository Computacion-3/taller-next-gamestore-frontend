import Link from 'next/link';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { Card } from '@/shared/presentation/components/ui/Card';
import { formatDateTime, formatPrice } from '@/shared/presentation/utils/format';
import { Purchase } from '../../domain/entities/Purchase';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';

export function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const count = purchase.items.length;

  return (
    <Card data-testid="purchase-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-cloud/60">
            {formatDateTime(purchase.createdAt)}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {count} {count === 1 ? 'juego' : 'juegos'}
          </p>
        </div>
        <div className="text-right">
          <PurchaseStatusBadge status={purchase.status} />
          <p className="mt-2 text-lg font-bold text-emerald-400">
            {formatPrice(purchase.totalAmount)}
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-blue-cloud/85">
        {purchase.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span className="truncate">{item.game.title}</span>
            <span>{formatPrice(item.priceAtPurchase)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end">
        <Link href={`/purchases/${purchase.id}`} className={buttonClasses('secondary', 'sm')}>
          Ver detalle
        </Link>
      </div>
    </Card>
  );
}