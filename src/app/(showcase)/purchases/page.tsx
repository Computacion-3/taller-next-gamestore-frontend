import type { Metadata } from 'next';
import { PurchaseHistory } from '@/features/purchases/presentation/components/PurchaseHistory';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Mis Compras · GameStore' };

export default function PurchasesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader
        title="Historial de Compras"
        subtitle="Todas tus compras, de la más reciente a la más antigua."
      />
      <PurchaseHistory />
    </main>
  );
}