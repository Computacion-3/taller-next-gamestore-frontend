import type { Metadata } from 'next';
import { LibraryView } from '@/features/library/presentation/components/LibraryView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Mi Biblioteca · GameStore' };

export default function LibraryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader
        title="Mi Biblioteca"
        subtitle="Los juegos que ya son tuyos, del más reciente al más antiguo."
      />
      <LibraryView />
    </main>
  );
}