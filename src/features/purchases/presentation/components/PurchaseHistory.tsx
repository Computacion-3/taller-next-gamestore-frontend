'use client';

import { useEffect } from 'react';
import { LoginRequired } from '@/features/auth/presentation/components/LoginRequired';
import { useSessionReady } from '@/features/auth/presentation/hooks/useSessionReady';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { formatPrice } from '@/shared/presentation/utils/format';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseCard } from './PurchaseCard';

export function PurchaseHistory() {
  const { sessionReady, isAuthenticated } = useSessionReady();
  const { purchases, isLoading, error, fetchMyPurchases } = usePurchases();

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      void fetchMyPurchases();
    }
  }, [sessionReady, isAuthenticated, fetchMyPurchases]);

  if (!sessionReady) {
    return <p className="text-sm text-slate-100">Cargando sesión...</p>;
  }
  if (!isAuthenticated) {
    return <LoginRequired message="Inicia sesión para ver tu historial de compras." />;
  }
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
        {error}
      </p>
    );
  }
  if (isLoading && purchases.length === 0) {
    return <p className="text-sm text-slate-100">Cargando tus compras...</p>;
  }
  if (purchases.length === 0) {
    return (
      <EmptyState
        title="Aún no has comprado juegos"
        description="Cuando compres un juego aparecerá aquí con el precio que pagaste."
        actionHref="/"
        actionLabel="Ir a la tienda"
      />
    );
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  return (
    <>
      <p className="mb-4 text-sm text-slate-100 drop-shadow">
        {purchases.length} compra(s) · Total invertido:{' '}
        <strong>{formatPrice(totalSpent)}</strong>
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {purchases.map((purchase) => (
          <PurchaseCard key={purchase.id} purchase={purchase} />
        ))}
      </div>
    </>
  );
}