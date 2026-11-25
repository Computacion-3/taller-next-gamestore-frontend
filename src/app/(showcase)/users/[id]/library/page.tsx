import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { UserLibraryView } from '@/features/library/presentation/components/UserLibraryView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Biblioteca del usuario · GameStore' };

export default function UserLibraryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth authority="users:manage">
        <PageHeader
          title="Biblioteca del usuario"
          subtitle="Juegos que posee este usuario (solo administradores)."
        />
        <Suspense fallback={<p className="text-sm text-slate-100">Cargando biblioteca...</p>}>
          <UserLibraryView />
        </Suspense>
      </RequireAuth>
    </main>
  );
}