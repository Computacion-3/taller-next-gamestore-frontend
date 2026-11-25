import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  GetMyLibraryUseCase,
  GetUserLibraryUseCase,
} from '../domain/usecases/libraryUseCases';
import { LibraryRestDatasource } from '../infrastructure/datasources/LibraryRestDatasource';
import { LibraryRepositoryImpl } from '../infrastructure/repositories/LibraryRepositoryImpl';

const datasource = new LibraryRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const libraryRepository = new LibraryRepositoryImpl(datasource);

export const libraryContainer = {
  getMyLibraryUseCase: new GetMyLibraryUseCase(libraryRepository),
  getUserLibraryUseCase: new GetUserLibraryUseCase(libraryRepository),
  libraryRepository,
};
