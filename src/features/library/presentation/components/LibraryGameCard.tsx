import { formatDate } from '@/shared/presentation/utils/format';
import { LibraryItem } from '../../domain/entities/LibraryItem';

export function LibraryGameCard({ item }: { item: LibraryItem }) {
  const { game } = item;

  return (
    <article
      className="overflow-hidden rounded-xl border border-blue-sky/40 bg-blue-night/80 shadow-xl backdrop-blur-md"
      data-testid="library-item"
    >
      {game.coverImage && (
        // Portadas con URL externa: <img> evita configurar dominios en next/image
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.coverImage}
          alt={game.title}
          loading="lazy"
          className="aspect-460/215 w-full object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{game.title}</h3>
          {!game.isActive && (
            <span className="shrink-0 rounded bg-slate-600 px-2 py-0.5 text-xs font-bold text-white">
              Retirado de la tienda
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-blue-cloud/70">{game.developer}</p>
        <p className="mt-3 text-xs text-blue-cloud/60">
          Adquirido el {formatDate(item.acquisitionDate)}
        </p>
      </div>
    </article>
  );
}