import Link from 'next/link';
import { Can } from '@/features/auth/presentation/components/Can';
import { Button } from '@/shared/presentation/components/ui/Button';
import { formatCalendarDate, formatPrice } from '@/shared/presentation/utils/format';
import { Game } from '../../../domain/entities/Game';

export interface AdminGamesTableProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDiscount: (game: Game) => void;
  onRemove: (game: Game) => void;
  onCategories: (game: Game) => void;
}

export function AdminGamesTable({ games, onEdit, onDiscount, onCategories, onRemove }: AdminGamesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-sky/40 bg-blue-night/80 backdrop-blur-md">
      <table data-testid="admin-games-table" className="w-full text-left text-sm">
        <caption className="sr-only">Juegos activos de la tienda</caption>
        <thead className="border-b border-blue-sky/30 text-xs uppercase tracking-wider text-blue-sky">
          <tr>
            <th scope="col" className="px-4 py-3">Juego</th>
            <th scope="col" className="px-4 py-3">Precio base</th>
            <th scope="col" className="px-4 py-3">Descuento</th>
            <th scope="col" className="px-4 py-3">Precio final</th>
            <th scope="col" className="px-4 py-3">Lanzamiento</th>
            <th scope="col" className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-sky/15 text-blue-cloud">
          {games.map((game) => (
            <tr key={game.id} data-testid={`admin-game-row-${game.id}`} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/games/${game.id}`} className="font-semibold text-white hover:text-blue-star">
                  {game.title}
                </Link>
                <p className="text-xs text-blue-cloud/60">{game.developer}</p>
              </td>
              <td className="px-4 py-3">{formatPrice(game.originalPrice)}</td>
              <td className="px-4 py-3">
                {game.hasDiscount ? (
                  <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                    -{game.discount}%
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-4 py-3 font-bold text-emerald-400">{formatPrice(game.price)}</td>
              <td className="px-4 py-3 text-blue-cloud/80">{formatCalendarDate(game.releaseDate)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Can authority="games:update">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(game)}>
                      Editar
                    </Button>
                  </Can>
                  <Can authority="games:discount">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDiscount(game)}
                      data-testid={`discount-${game.id}`}
                    >
                      Descuento
                    </Button>
                  </Can>
                  <Can authority="categories:manage">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onCategories(game)}
                      data-testid={`categories-${game.id}`}
                    >
                      Categorías
                    </Button>
                  </Can>
                  <Can authority="games:delete">
                    <Button size="sm" variant="danger" onClick={() => onRemove(game)}>
                      Retirar
                    </Button>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}