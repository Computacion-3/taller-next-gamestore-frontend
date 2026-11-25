import type { Metadata } from 'next';
import { AdminNav } from '@/features/auth/presentation/components/AdminNav';
import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { AdminCategoriesPanel } from '@/features/categories/presentation/components/admin/AdminCategoriesPanel';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Administrar categorías · GameStore' };

export default function AdminCategoriesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth authority="categories:manage">
        <AdminNav />
        <PageHeader
          title="Administrar categorías"
          subtitle="Crea, edita o elimina los géneros de la tienda."
        />
        <AdminCategoriesPanel />
      </RequireAuth>
    </main>
  );
}