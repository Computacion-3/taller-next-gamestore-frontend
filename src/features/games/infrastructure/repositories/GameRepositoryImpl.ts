import { Game } from '../../domain/entities/Game';
import {
  CreateGameParams,
  GameRepository,
  GetGamesParams,
  UpdateGameParams,
} from '../../domain/repositories/GameRepository';
import { GameDatasource } from '../datasources/GameDatasource';
import { GameMapper } from '../mappers/GameMapper';

export type DataSourceType = 'rest' | 'graphql';

export class GameRepositoryImpl implements GameRepository {
  private readonly activeDatasource: GameDatasource;

  constructor(
    private readonly restDatasource: GameDatasource,
    private readonly graphqlDatasource: GameDatasource,
    sourceOverride?: DataSourceType,
  ) {
    const configuredSource = (
      sourceOverride ??
      process.env.NEXT_PUBLIC_DATA_SOURCE ??
      'rest'
    ).toLowerCase();

    if (configuredSource !== 'rest' && configuredSource !== 'graphql') {
      throw new Error(
        `NEXT_PUBLIC_DATA_SOURCE inválido: "${configuredSource}". Usa "rest" o "graphql".`,
      );
    }

    this.activeDatasource =
      configuredSource === 'graphql'
        ? this.graphqlDatasource
        : this.restDatasource;
  }

  async getAll(params?: GetGamesParams): Promise<Game[]> {
    const dtos = await this.activeDatasource.getAll(params);
    return dtos.map(GameMapper.toDomain);
  }

  async getById(id: string): Promise<Game> {
    const dto = await this.activeDatasource.getById(id);
    return GameMapper.toDomain(dto);
  }

  async create(params: CreateGameParams): Promise<Game> {
    const payload = GameMapper.toCreateDto(params);
    const dto = await this.activeDatasource.create(payload);
    return GameMapper.toDomain(dto);
  }

  async update(id: string, params: UpdateGameParams): Promise<Game> {
    const payload = GameMapper.toUpdateDto(params);
    const dto = await this.activeDatasource.update(id, payload);
    return GameMapper.toDomain(dto);
  }

  async updateDiscount(id: string, discount: number): Promise<Game> {
    const dto = await this.activeDatasource.updateDiscount(id, discount);
    return GameMapper.toDomain(dto);
  }

  async delete(id: string): Promise<void> {
    await this.activeDatasource.delete(id);
  }
}
