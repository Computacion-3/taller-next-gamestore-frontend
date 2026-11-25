import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  UpdateCategoryUseCase,
  GetCategoryDetailUseCase,
} from '../domain/usecases/categoryUseCases';
import { CategoryRestDatasource } from '../infrastructure/datasources/CategoryRestDatasource';
import { CategoryRepositoryImpl } from '../infrastructure/repositories/CategoryRepositoryImpl';

const datasource = new CategoryRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const categoryRepository = new CategoryRepositoryImpl(datasource);

export const categoriesContainer = {
  getCategoriesUseCase: new GetCategoriesUseCase(categoryRepository),
  createCategoryUseCase: new CreateCategoryUseCase(categoryRepository),
  updateCategoryUseCase: new UpdateCategoryUseCase(categoryRepository),
  deleteCategoryUseCase: new DeleteCategoryUseCase(categoryRepository),
  getCategoryDetailUseCase: new GetCategoryDetailUseCase(categoryRepository),
  categoryRepository,
};
