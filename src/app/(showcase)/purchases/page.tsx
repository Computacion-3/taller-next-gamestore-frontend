import type { Metadata } from 'next';
import { PurchaseHistory } from '@/features/purchases/presentation/components/PurchaseHistory';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';
import Link from 'next/link';
import { Can } from '@/features/auth/presentation/components/Can';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';

export const metadata: Metadata = { title: 'Mis Compras · GameStore' };

export default function PurchasesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader
        title="Historial de Compras"
        subtitle="Todas tus compras, de la más reciente a la más antigua."
      >
        <Can authority="purchases:view_all">
          <Link href="/purchases/all" className={buttonClasses('secondary', 'sm')}>
            Ver todas las compras
          </Link>
        </Can>
      </PageHeader>
      <PurchaseHistory />
    </main>
  );
}