import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GameDetailView } from '@/features/games/presentation/components/GameDetailView';

export const metadata: Metadata = { title: 'Detalle del juego · GameStore' };

export default function GameDetailPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 text-slate-100">
      <Suspense fallback={<p className="text-sm text-slate-100">Cargando juego...</p>}>
        <GameDetailView />
      </Suspense>
    </main>
  );
}