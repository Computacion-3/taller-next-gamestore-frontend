import { Game } from '../../domain/entities/Game';

export interface GamesState {
  items: Game[];
  isLoading: boolean;
  error: string | null;
}

export const initialGamesState: GamesState = {
  items: [],
  isLoading: false,
  error: null,
};
