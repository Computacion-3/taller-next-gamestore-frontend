import { GetGamesParams } from '../../domain/repositories/GameRepository';
import { CreateGameDto, GameDto, UpdateGameDto } from '../dtos/GameDto';
import { GameDatasource } from './GameDatasource';

const GAME_FIELDS = `
  id
  title
  description
  price
  originalPrice
  discount
  developer
  releaseDate
  coverImage
  isActive
  createdAt
  updatedAt
`;

export class GameGraphQLDatasource implements GameDatasource {
  private readonly endpoint: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    private readonly getToken?: () => string | null,
  ) {
    this.endpoint = `${baseUrl.replace(/\/$/, '')}/graphql`;
  }

  private async request<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Error GraphQL HTTP (${response.status})`);
    }

    const json = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors.map((e) => e.message).join(', '));
    }

    if (!json.data) {
      throw new Error('Respuesta GraphQL vacía');
    }

    return json.data;
  }

  async getAll(params?: GetGamesParams): Promise<GameDto[]> {
    const data = await this.request<{ games: GameDto[] }>(
      `query GetGames($search: String, $categoryId: String, $page: Int, $limit: Int) {
        games(search: $search, categoryId: $categoryId, page: $page, limit: $limit) {
          ${GAME_FIELDS}
        }
      }`,
      params ? { ...params } : undefined,
    );
    return data.games;
  }

  async getById(id: string): Promise<GameDto> {
    const data = await this.request<{ game: GameDto }>(
      `query GetGame($id: ID!) {
        game(id: $id) {
          ${GAME_FIELDS}
        }
      }`,
      { id },
    );
    return data.game;
  }

  async create(dto: CreateGameDto): Promise<GameDto> {
    const data = await this.request<{ createGame: GameDto }>(
      `mutation CreateGame($input: CreateGameInput!) {
        createGame(input: $input) {
          ${GAME_FIELDS}
        }
      }`,
      { input: dto },
    );
    return data.createGame;
  }

  async update(id: string, dto: UpdateGameDto): Promise<GameDto> {
    const data = await this.request<{ updateGame: GameDto }>(
      `mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {
        updateGame(id: $id, input: $input) {
          ${GAME_FIELDS}
        }
      }`,
      { id, input: dto },
    );
    return data.updateGame;
  }

  async updateDiscount(id: string, discount: number): Promise<GameDto> {
    const data = await this.request<{ updateGameDiscount: GameDto }>(
      `mutation UpdateGameDiscount($id: ID!, $discount: Float!) {
        updateGameDiscount(id: $id, discount: $discount) {
          ${GAME_FIELDS}
        }
      }`,
      { id, discount },
    );
    return data.updateGameDiscount;
  }

  async delete(id: string): Promise<void> {
    await this.request<{ removeGame: boolean }>(
      `mutation RemoveGame($id: ID!) {
        removeGame(id: $id)
      }`,
      { id },
    );
  }
}
