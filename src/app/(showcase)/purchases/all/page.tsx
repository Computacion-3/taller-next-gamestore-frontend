import type { Metadata } from 'next';
import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { AllPurchasesView } from '@/features/purchases/presentation/components/AllPurchasesView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Todas las compras · GameStore' };

export default function AllPurchasesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth authority="purchases:view_all">
        <PageHeader
          title="Todas las compras"
          subtitle="Historial global de la tienda (solo administradores)."
        />
        <AllPurchasesView />
      </RequireAuth>
    </main>
  );
}