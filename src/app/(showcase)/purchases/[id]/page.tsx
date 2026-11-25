import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PurchaseDetailView } from '@/features/purchases/presentation/components/PurchaseDetailView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Detalle de compra · GameStore' };

export default function PurchaseDetailPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader
        title="Detalle de compra"
        subtitle="Juegos incluidos y precio pagado por cada uno."
      />
      <Suspense fallback={<p className="text-sm text-slate-100">Cargando compra...</p>}>
        <PurchaseDetailView />
      </Suspense>
    </main>
  );
}