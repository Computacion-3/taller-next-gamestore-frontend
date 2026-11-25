import { Category } from '../entities/Category';
import {
  CategoryDetail,
  CategoryRepository,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '../repositories/CategoryRepository';

export class GetCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}
  execute(): Promise<Category[]> {
    return this.repository.getAll();
  }
}

export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}
  execute(params: CreateCategoryParams): Promise<Category> {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('El nombre de la categoría es obligatorio.');
    }
    return this.repository.create(params);
  }
}

export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}
  execute(id: string, params: UpdateCategoryParams): Promise<Category> {
    return this.repository.update(id, params);
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}
  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export class GetCategoryDetailUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string): Promise<CategoryDetail> {
    if (!id || id.trim().length === 0) {
      throw new Error('El identificador de la categoría es obligatorio.');
    }
    // Las dos consultas son independientes: se hacen en paralelo
    const [category, games] = await Promise.all([
      this.repository.getById(id),
      this.repository.getGames(id),
    ]);
    return { category, games };
  }
}
