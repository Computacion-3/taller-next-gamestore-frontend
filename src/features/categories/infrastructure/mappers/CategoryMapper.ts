import { Category } from '../../domain/entities/Category';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../../domain/repositories/CategoryRepository';
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dtos/CategoryDto';

export class CategoryMapper {
  static toDomain(dto: CategoryDto): Category {
    return new Category({
      id: dto.id,
      name: dto.name,
      description: dto.description ?? null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
    });
  }

  static toCreateDto(params: CreateCategoryParams): CreateCategoryDto {
    return {
      name: params.name.trim(),
      ...(params.description ? { description: params.description.trim() } : {}),
    };
  }

  static toUpdateDto(params: UpdateCategoryParams): UpdateCategoryDto {
    return {
      ...(params.name !== undefined && { name: params.name.trim() }),
      ...(params.description !== undefined &&
        params.description !== null && {
          description: params.description.trim(),
        }),
    };
  }
}
