import { RestHttpClient } from '@/shared/infrastructure/http/httpClient';
import { GetGamesParams } from '../../domain/repositories/GameRepository';
import {
  CreateGameDto,
  GameDto,
  PaginatedGamesDto,
  UpdateGameDto,
} from '../dtos/GameDto';
import { GameDatasource } from './GameDatasource';

/**
 * Datasource REST de juegos. Usa el RestHttpClient compartido, que adjunta el JWT
 * y devuelve el mensaje de error real del backend (validaciones, 404, 403...).
 */
export class GameRestDatasource implements GameDatasource {
  private readonly http: RestHttpClient;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.http = new RestHttpClient(baseUrl, getToken);
  }

  getAll(params?: GetGamesParams): Promise<PaginatedGamesDto> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', params.categoryId);

    const qs = query.toString();
    return this.http.request<PaginatedGamesDto>(`/games${qs ? `?${qs}` : ''}`);
  }

  getById(id: string): Promise<GameDto> {
    return this.http.request<GameDto>(`/games/${id}`);
  }

  create(dto: CreateGameDto): Promise<GameDto> {
    return this.http.request<GameDto>('/games', { method: 'POST', body: dto });
  }

  update(id: string, dto: UpdateGameDto): Promise<GameDto> {
    return this.http.request<GameDto>(`/games/${id}`, { method: 'PATCH', body: dto });
  }

  updateDiscount(id: string, discount: number): Promise<GameDto> {
    return this.http.request<GameDto>(`/games/${id}/discount`, {
      method: 'PATCH',
      body: { discount },
    });
  }

  async delete(id: string): Promise<void> {
    await this.http.request<void>(`/games/${id}`, { method: 'DELETE' });
  }
}