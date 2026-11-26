import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import {
  ChangeMyPasswordUseCase,
  GetUsersUseCase,
  UpdateMyEmailUseCase,
  UpdateUserRoleUseCase,
  GetMyAccountUseCase,
} from '../domain/usecases/userUseCases';
import { UserRestDatasource } from '../infrastructure/datasources/UserRestDatasource';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';

const datasource = new UserRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const userRepository = new UserRepositoryImpl(datasource);

export const usersContainer = {
  getUsersUseCase: new GetUsersUseCase(userRepository),
  updateUserRoleUseCase: new UpdateUserRoleUseCase(userRepository),
  updateMyEmailUseCase: new UpdateMyEmailUseCase(userRepository),
  changeMyPasswordUseCase: new ChangeMyPasswordUseCase(userRepository),
  getMyAccountUseCase: new GetMyAccountUseCase(userRepository),
  userRepository,
};
