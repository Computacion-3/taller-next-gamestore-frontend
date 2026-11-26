import type { Metadata } from 'next';
import { AdminNav } from '@/features/auth/presentation/components/AdminNav';
import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { AdminGamesPanel } from '@/features/games/presentation/components/admin/AdminGamesPanel';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Administrar juegos · GameStore' };

export default function AdminGamesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth authority="games:create">
        <AdminNav />
        <PageHeader
          title="Administrar juegos"
          subtitle="Crea, edita, aplica descuentos o retira juegos de la tienda."
        />
        <AdminGamesPanel />
      </RequireAuth>
    </main>
  );
}