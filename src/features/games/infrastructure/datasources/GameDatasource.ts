import {
  CreateGameParams,
  GetGamesParams,
  UpdateGameParams,
} from '../../domain/repositories/GameRepository';
import { CreateGameDto, GameDto, UpdateGameDto } from '../dtos/GameDto';

export interface GameDatasource {
  getAll(params?: GetGamesParams): Promise<GameDto[]>;
  getById(id: string): Promise<GameDto>;
  create(dto: CreateGameDto): Promise<GameDto>;
  update(id: string, dto: UpdateGameDto): Promise<GameDto>;
  updateDiscount(id: string, discount: number): Promise<GameDto>;
  delete(id: string): Promise<void>;
}

export type { CreateGameParams, GetGamesParams, UpdateGameParams };
