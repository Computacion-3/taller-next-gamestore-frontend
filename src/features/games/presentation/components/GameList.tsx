import { Game } from '../../domain/entities/Game';
import { GameCard } from './GameCard';

export interface GameListProps {
  games: Game[];
  isLoading?: boolean;
  error?: string | null;
}

export function GameList({ games, isLoading, error }: GameListProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-400">Cargando catálogo...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (games.length === 0) {
    return (
      <p className="text-sm text-slate-400">No se encontraron videojuegos.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
