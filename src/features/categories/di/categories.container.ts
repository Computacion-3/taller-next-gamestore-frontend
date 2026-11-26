import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  UpdateCategoryUseCase,
  GetCategoryDetailUseCase,
  GetGameCategoriesUseCase,
  AssignCategoryToGameUseCase,
  RemoveCategoryFromGameUseCase,
  SetGameCategoriesUseCase,
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
  getGameCategoriesUseCase: new GetGameCategoriesUseCase(categoryRepository),
  assignCategoryToGameUseCase: new AssignCategoryToGameUseCase(categoryRepository),
  removeCategoryFromGameUseCase: new RemoveCategoryFromGameUseCase(categoryRepository),
  setGameCategoriesUseCase: new SetGameCategoriesUseCase(categoryRepository),
  categoryRepository,
};
