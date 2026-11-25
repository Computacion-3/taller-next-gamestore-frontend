import { formatPrice } from '@/shared/presentation/utils/format';
import { PriceAlert } from '../../domain/entities/WishlistItem';

export function PriceAlertsBanner({ alerts }: { alerts: PriceAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <section
      aria-labelledby="price-alerts-title"
      className="mb-6 rounded-2xl border border-emerald-400/50 bg-emerald-950/80 p-5 shadow-xl backdrop-blur-md"
      data-testid="price-alerts"
    >
      <h2
        id="price-alerts-title"
        className="text-sm font-bold uppercase tracking-wider text-emerald-200"
      >
        Alertas de precio ({alerts.length})
      </h2>
      <ul className="mt-3 space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.wishlistItemId}
            className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-emerald-50"
          >
            <span>
              <strong>{alert.title}</strong> · {alert.message}
            </span>
            <span className="font-semibold">
              {formatPrice(alert.currentPrice)}{' '}
              <span className="text-xs font-normal text-emerald-200/80">
                (objetivo {formatPrice(alert.targetPrice)})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}