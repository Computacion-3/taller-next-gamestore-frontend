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
  create(params: CreateCategoryParams): Promise<Category>;
  update(id: string, params: UpdateCategoryParams): Promise<Category>;
  delete(id: string): Promise<void>;
}