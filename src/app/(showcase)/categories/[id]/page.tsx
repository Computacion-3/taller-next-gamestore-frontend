import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryDetailView } from '@/features/categories/presentation/components/CategoryDetailView';

export const metadata: Metadata = { title: 'Categoría · GameStore' };

export default function CategoryDetailPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <Suspense fallback={<p className="text-sm text-slate-100">Cargando categoría...</p>}>
        <CategoryDetailView />
      </Suspense>
    </main>
  );
}