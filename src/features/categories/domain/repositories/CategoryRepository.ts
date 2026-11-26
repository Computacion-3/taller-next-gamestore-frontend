import { Game } from '@/features/games/domain/entities/Game';
import { Category } from '../entities/Category';

export interface CreateCategoryParams {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryParams {
  name?: string;
  description?: string | null;
}

/** Una categoría con sus juegos activos. */
export interface CategoryDetail {
  category: Category;
  games: Game[];
}

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category>;
  getGames(categoryId: string): Promise<Game[]>;
  getByGame(gameId: string): Promise<Category[]>;
  create(params: CreateCategoryParams): Promise<Category>;
  update(id: string, params: UpdateCategoryParams): Promise<Category>;
  delete(id: string): Promise<void>;
  /** POST /games/:gameId/categories/:categoryId */
  assignToGame(gameId: string, categoryId: string): Promise<void>;
  /** DELETE /games/:gameId/categories/:categoryId */
  removeFromGame(gameId: string, categoryId: string): Promise<void>;
  /** PUT /games/:gameId/categories: reemplaza todas (un arreglo vacío las quita). */
  setForGame(gameId: string, categoryIds: string[]): Promise<Category[]>;
}