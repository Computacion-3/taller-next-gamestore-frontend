import { Category } from '../entities/Category';

export interface CreateCategoryParams {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryParams {
  name?: string;
  description?: string | null;
}

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category>;
  create(params: CreateCategoryParams): Promise<Category>;
  update(id: string, params: UpdateCategoryParams): Promise<Category>;
  delete(id: string): Promise<void>;
}
