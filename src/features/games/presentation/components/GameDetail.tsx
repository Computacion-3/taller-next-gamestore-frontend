import Link from 'next/link';
import { ReactNode } from 'react';
import { Category } from '@/features/categories/domain/entities/Category';
import { formatCalendarDate, formatPrice } from '@/shared/presentation/utils/format';
import { Game } from '../../domain/entities/Game';

export interface GameDetailProps {
  game: Game;
  categories: Category[];
  /** Acciones (comprar, wishlist) que decide el contenedor. */
  actions?: ReactNode;
}

export function GameDetail({ game, categories, actions }: GameDetailProps) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-blue-sky/40 bg-blue-night/80 shadow-xl backdrop-blur-md"
      data-testid="game-detail"
    >
      {game.coverImage && (
        // Portadas con URL externa: <img> evita configurar dominios en next/image
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.coverImage}
          alt={game.title}
          className="aspect-460/215 w-full object-cover"
        />
      )}

      <div className="grid gap-6 p-6 md:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-3xl font-extrabold text-white">{game.title}</h1>
          <p className="mt-1 text-sm text-blue-cloud/70">
            {game.developer} · Lanzamiento: {formatCalendarDate(game.releaseDate)}
          </p>

          {categories.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Categorías del juego">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="inline-block rounded-full border border-blue-sky/50 px-3 py-1 text-xs font-semibold text-blue-sky transition hover:border-blue-star hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-blue-cloud/90">
            {game.description}
          </p>
        </div>

        <aside className="h-fit rounded-xl border border-blue-sky/30 bg-blue-night/60 p-4">
          {game.hasDiscount && (
            <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              -{game.discount}%
            </span>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            {game.hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(game.originalPrice)}
              </span>
            )}
            <span className="text-2xl font-bold text-emerald-400" data-testid="game-detail-price">
              {formatPrice(game.price)}
            </span>
          </div>

          {game.isActive ? (
            actions && <div className="mt-4">{actions}</div>
          ) : (
            <p
              role="status"
              className="mt-4 rounded-md border border-amber-400/50 bg-amber-950/60 px-3 py-2 text-xs text-amber-100"
            >
              Este juego fue retirado de la tienda y ya no se puede comprar.
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}