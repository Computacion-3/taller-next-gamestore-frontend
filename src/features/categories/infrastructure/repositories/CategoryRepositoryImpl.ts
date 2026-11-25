import { Category } from '../../domain/entities/Category';
import { Game } from '@/features/games/domain/entities/Game';
import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import {
  CategoryRepository,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../domain/repositories/CategoryRepository';
import { CategoryDatasource } from '../datasources/CategoryRestDatasource';
import { CategoryMapper } from '../mappers/CategoryMapper';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly datasource: CategoryDatasource) {}

  async getAll(): Promise<Category[]> {
    const dtos = await this.datasource.getAll();
    return dtos.map(CategoryMapper.toDomain);
  }

  async getById(id: string): Promise<Category> {
    const dto = await this.datasource.getById(id);
    return CategoryMapper.toDomain(dto);
  }

  async getGames(categoryId: string): Promise<Game[]> {
    const dtos = await this.datasource.getGames(categoryId);
    return dtos.map(GameMapper.toDomain);
  }

  async getByGame(gameId: string): Promise<Category[]> {
    const dtos = await this.datasource.getByGame(gameId);
    return dtos.map(CategoryMapper.toDomain);
  }

  async create(params: CreateCategoryParams): Promise<Category> {
    const dto = await this.datasource.create(CategoryMapper.toCreateDto(params));
    return CategoryMapper.toDomain(dto);
  }

  async update(id: string, params: UpdateCategoryParams): Promise<Category> {
    const dto = await this.datasource.update(
      id,
      CategoryMapper.toUpdateDto(params),
    );
    return CategoryMapper.toDomain(dto);
  }

  async delete(id: string): Promise<void> {
    await this.datasource.delete(id);
  }
}
