import { GetProfileUseCase } from '../domain/usecases/GetProfileUseCase';
import { GetStoredSessionUseCase } from '../domain/usecases/GetStoredSessionUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../domain/usecases/LogoutUseCase';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { SaveSessionUserUseCase } from '../domain/usecases/SaveSessionUserUseCase';
import { AuthRestDatasource } from '../infrastructure/datasources/AuthRestDatasource';
import { AuthRepositoryImpl } from '../infrastructure/repositories/AuthRepositoryImpl';
import { tokenStorage } from '../infrastructure/storage/tokenStorage';

const authDatasource = new AuthRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);

const authRepository = new AuthRepositoryImpl(authDatasource, tokenStorage);

export const authContainer = {
  loginUseCase: new LoginUseCase(authRepository),
  registerUseCase: new RegisterUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),
  getProfileUseCase: new GetProfileUseCase(authRepository),
  getStoredSessionUseCase: new GetStoredSessionUseCase(authRepository),
  saveSessionUserUseCase: new SaveSessionUserUseCase(authRepository),
  authRepository,
};
