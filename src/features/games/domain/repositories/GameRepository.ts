import { Game } from '../entities/Game';

export interface GetGamesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

/** Una página del catálogo más los datos necesarios para paginar. */
export interface PaginatedGames {
  items: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateGameParams {
  title: string;
  description: string;
  originalPrice: number;
  discount?: number;
  developer: string;
  releaseDate: Date;
  coverImage?: string | null;
  categoryIds?: string[];
}

export interface UpdateGameParams {
  title?: string;
  description?: string;
  originalPrice?: number;
  developer?: string;
  releaseDate?: Date;
  coverImage?: string | null;
  categoryIds?: string[];
}

export interface GameRepository {
  getAll(params?: GetGamesParams): Promise<PaginatedGames>;
  getById(id: string): Promise<Game>;
  create(params: CreateGameParams): Promise<Game>;
  update(id: string, params: UpdateGameParams): Promise<Game>;
  updateDiscount(id: string, discount: number): Promise<Game>;
  delete(id: string): Promise<void>;
}