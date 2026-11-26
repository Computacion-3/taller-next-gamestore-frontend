'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { Card } from '@/shared/presentation/components/ui/Card';
import { formatDateTime, formatPrice } from '@/shared/presentation/utils/format';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';

export function PurchaseDetailView() {
  const { id } = useParams<{ id: string }>();
  const { sessionReady, isAuthenticated } = useSessionReady();
  const { selectedPurchase, isLoading, error, fetchPurchaseById } = usePurchases();

  useEffect(() => {
    if (sessionReady && isAuthenticated && id) {
      void fetchPurchaseById(id);
    }
  }, [sessionReady, isAuthenticated, id, fetchPurchaseById]);

  const backLink = (
    <Link href="/purchases" className={buttonClasses('secondary', 'sm')}>
      ← Volver al historial
    </Link>
  );

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver el detalle de tu compra." />;
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
        {backLink}
      </div>
    );
  }
  if (isLoading || !selectedPurchase || selectedPurchase.id !== id) {
    return <p className="text-sm text-slate-100">Cargando compra...</p>;
  }

  const purchase = selectedPurchase;

  return (
    <Card data-testid="purchase-detail">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-cloud/60">
            {formatDateTime(purchase.createdAt)}
          </p>
          <p className="mt-1 font-mono text-xs text-blue-cloud/60">ID: {purchase.id}</p>
        </div>
        <PurchaseStatusBadge status={purchase.status} />
      </div>

      <table className="mt-5 w-full text-sm">
        <caption className="sr-only">Juegos incluidos en la compra</caption>
        <thead>
          <tr className="border-b border-blue-sky/30 text-left text-xs uppercase tracking-wider text-blue-cloud/60">
            <th scope="col" className="py-2">Juego</th>
            <th scope="col" className="py-2">Desarrollador</th>
            <th scope="col" className="py-2 text-right">Precio pagado</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((item) => (
            <tr key={item.id} className="border-b border-blue-sky/10">
              <td className="py-2 font-semibold text-white">{item.game.title}</td>
              <td className="py-2 text-blue-cloud/80">{item.game.developer}</td>
              <td className="py-2 text-right">{formatPrice(item.priceAtPurchase)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2} className="pt-3 text-left text-white">Total</th>
            <td className="pt-3 text-right text-lg font-bold text-emerald-400">
              {formatPrice(purchase.totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-4 text-xs text-blue-cloud/60">
        El precio pagado se conserva aunque el juego cambie de precio después.
      </p>

      <div className="mt-5">{backLink}</div>
    </Card>
  );
}