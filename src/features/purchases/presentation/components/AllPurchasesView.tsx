'use client';

import { useEffect } from 'react';
import { Card } from '@/shared/presentation/components/ui/Card';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { formatPrice } from '@/shared/presentation/utils/format';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseCard } from './PurchaseCard';

/** Vista de admin: todas las compras de la tienda. Se renderiza dentro de RequireAuth. */
export function AllPurchasesView() {
  const { allPurchases, isLoading, error, fetchAllPurchases } = usePurchases();

  useEffect(() => {
    void fetchAllPurchases();
  }, [fetchAllPurchases]);

  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
        {error}
      </p>
    );
  }
  if (isLoading && allPurchases.length === 0) {
    return <p className="text-sm text-slate-100">Cargando compras...</p>;
  }
  if (allPurchases.length === 0) {
    return <EmptyState title="Todavía no hay compras en la tienda" />;
  }

  const revenue = allPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const buyers = new Set(allPurchases.map((purchase) => purchase.user?.id).filter(Boolean)).size;

  const stats = [
    { label: 'Compras', value: String(allPurchases.length) },
    { label: 'Ingresos', value: formatPrice(revenue) },
    { label: 'Compradores', value: String(buyers) },
  ];

  return (
    <>
      <dl className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <dt className="text-xs uppercase tracking-wider text-blue-cloud/60">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-white">{stat.value}</dd>
          </Card>
        ))}
      </dl>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {allPurchases.map((purchase) => (
          <PurchaseCard key={purchase.id} purchase={purchase} showBuyer />
        ))}
      </div>
    </>
  );
}