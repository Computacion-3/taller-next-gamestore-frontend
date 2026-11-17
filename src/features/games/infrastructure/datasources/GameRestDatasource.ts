import { GetGamesParams } from '../../domain/repositories/GameRepository';
import { CreateGameDto, GameDto, UpdateGameDto } from '../dtos/GameDto';
import { GameDatasource } from './GameDatasource';

export class GameRestDatasource implements GameDatasource {
  private readonly baseUrl: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    private readonly getToken?: () => string | null,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async getAll(params?: GetGamesParams): Promise<GameDto[]> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', params.categoryId);

    const qs = query.toString();
    const url = `${this.baseUrl}/games${qs ? `?${qs}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error REST al obtener videojuegos (${response.status})`);
    }

    return response.json();
  }

  async getById(id: string): Promise<GameDto> {
    const response = await fetch(`${this.baseUrl}/games/${id}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error REST al obtener videojuego ${id} (${response.status})`);
    }

    return response.json();
  }

  async create(dto: CreateGameDto): Promise<GameDto> {
    const response = await fetch(`${this.baseUrl}/games`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Error REST al crear videojuego (${response.status})`);
    }

    return response.json();
  }

  async update(id: string, dto: UpdateGameDto): Promise<GameDto> {
    const response = await fetch(`${this.baseUrl}/games/${id}`, {
      method: 'PATCH',
      headers: this.buildHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Error REST al actualizar videojuego ${id} (${response.status})`);
    }

    return response.json();
  }

  async updateDiscount(id: string, discount: number): Promise<GameDto> {
    const response = await fetch(`${this.baseUrl}/games/${id}/discount`, {
      method: 'PATCH',
      headers: this.buildHeaders(),
      body: JSON.stringify({ discount }),
    });

    if (!response.ok) {
      throw new Error(`Error REST al actualizar descuento de ${id} (${response.status})`);
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/games/${id}`, {
      method: 'DELETE',
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error REST al eliminar videojuego ${id} (${response.status})`);
    }
  }
}
