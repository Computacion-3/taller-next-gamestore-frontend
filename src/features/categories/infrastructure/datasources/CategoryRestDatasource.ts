import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dtos/CategoryDto';
import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';

export interface CategoryDatasource {
  getAll(): Promise<CategoryDto[]>;
  getById(id: string): Promise<CategoryDto>;
  getGames(categoryId: string): Promise<GameDto[]>;
  getByGame(gameId: string): Promise<CategoryDto[]>;
  create(dto: CreateCategoryDto): Promise<CategoryDto>;
  update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto>;
  delete(id: string): Promise<void>;
  assignToGame(gameId: string, categoryId: string): Promise<void>;
  removeFromGame(gameId: string, categoryId: string): Promise<void>;
  setForGame(gameId: string, categoryIds: string[]): Promise<CategoryDto[]>;
}

export class CategoryRestDatasource implements CategoryDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  getAll(): Promise<CategoryDto[]> {
    return this.http.request<CategoryDto[]>('/categories');
  }

  getById(id: string): Promise<CategoryDto> {
    return this.http.request<CategoryDto>(`/categories/${id}`);
  }

  getGames(categoryId: string): Promise<GameDto[]> {
    return this.http.request<GameDto[]>(`/categories/${categoryId}/games`);
  }

  getByGame(gameId: string): Promise<CategoryDto[]> {
    return this.http.request<CategoryDto[]>(`/games/${gameId}/categories`);
  }

  create(dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.http.request<CategoryDto>('/categories', {
      method: 'POST',
      body: dto,
    });
  }

  update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto> {
    return this.http.request<CategoryDto>(`/categories/${id}`, {
      method: 'PATCH',
      body: dto,
    });
  }

  delete(id: string): Promise<void> {
    return this.http.request<void>(`/categories/${id}`, { method: 'DELETE' });
  }

  async assignToGame(gameId: string, categoryId: string): Promise<void> {
    await this.http.request(`/games/${gameId}/categories/${categoryId}`, {
      method: 'POST',
    });
  }

  async removeFromGame(gameId: string, categoryId: string): Promise<void> {
    await this.http.request(`/games/${gameId}/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  setForGame(gameId: string, categoryIds: string[]): Promise<CategoryDto[]> {
    return this.http.request<CategoryDto[]>(`/games/${gameId}/categories`, {
      method: 'PUT',
      body: { categoryIds },
    });
  }
}
