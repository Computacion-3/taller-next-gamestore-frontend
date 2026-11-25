import { ReactNode } from 'react';
import { Game } from '../../domain/entities/Game';

export interface GameCardProps {
  game: Game;
  /** Acciones opcionales (botones) que decide el contenedor. */
  actions?: ReactNode;
}

export function GameCard({ game, actions }: GameCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-md">
      {game.coverImage && (
        <img
          src={game.coverImage}
          alt={game.title}
          loading="lazy"
          className="aspect-[460/215] w-full object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{game.title}</h3>
          {game.hasDiscount && (
            <span className="shrink-0 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              -{game.discount}%
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">{game.developer}</p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-300">
          {game.description}
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          {game.hasDiscount && (
            <span className="text-xs text-slate-500 line-through">
              ${game.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base font-bold text-emerald-400">
            ${game.price.toFixed(2)}
          </span>
        </div>
        {actions && (
          <div className="mt-4 border-t border-slate-800 pt-3">{actions}</div>
        )}        
      </div>
    </article>
  );
}
