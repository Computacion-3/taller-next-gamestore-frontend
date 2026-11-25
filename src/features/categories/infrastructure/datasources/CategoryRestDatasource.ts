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
  create(dto: CreateCategoryDto): Promise<CategoryDto>;
  update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto>;
  delete(id: string): Promise<void>;
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
}
