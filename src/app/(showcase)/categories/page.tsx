import type { Metadata } from 'next';
import { CategoriesView } from '@/features/categories/presentation/components/CategoriesView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Categorías · GameStore' };

export default function CategoriesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader title="Categorías" subtitle="Explora los géneros de la tienda." />
      <CategoriesView />
    </main>
  );
}