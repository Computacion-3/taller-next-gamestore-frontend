import { Suspense } from 'react';
import { GameCatalog } from '@/features/games/presentation/components/GameCatalog';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white drop-shadow">
          Catálogo de Juegos
        </h1>
        <p className="mt-1 text-sm text-slate-100 drop-shadow">
          Explora los títulos disponibles en la tienda.
        </p>
      </div>

      <Suspense
        fallback={<p className="text-sm text-slate-100">Cargando catálogo...</p>}
      >
        <GameCatalog />
      </Suspense>
    </main>
  );
}