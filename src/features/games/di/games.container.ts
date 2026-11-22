import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import { CreateGameUseCase } from '../domain/usecases/CreateGameUseCase';
import { DeleteGameUseCase } from '../domain/usecases/DeleteGameUseCase';
import { GetGameByIdUseCase } from '../domain/usecases/GetGameByIdUseCase';
import { GetGamesUseCase } from '../domain/usecases/GetGamesUseCase';
import { UpdateGameDiscountUseCase } from '../domain/usecases/UpdateGameDiscountUseCase';
import { UpdateGameUseCase } from '../domain/usecases/UpdateGameUseCase';
import { GameGraphQLDatasource } from '../infrastructure/datasources/GameGraphQLDatasource';
import { GameRestDatasource } from '../infrastructure/datasources/GameRestDatasource';
import { GameRepositoryImpl } from '../infrastructure/repositories/GameRepositoryImpl';

const restDatasource = new GameRestDatasource(undefined, () =>
  tokenStorage.getToken(),
);
const graphqlDatasource = new GameGraphQLDatasource(undefined, () =>
  tokenStorage.getToken(),
);

const gameRepository = new GameRepositoryImpl(
  restDatasource,
  graphqlDatasource,
);

export const gamesContainer = {
  getGamesUseCase: new GetGamesUseCase(gameRepository),
  getGameByIdUseCase: new GetGameByIdUseCase(gameRepository),
  createGameUseCase: new CreateGameUseCase(gameRepository),
  updateGameUseCase: new UpdateGameUseCase(gameRepository),
  updateGameDiscountUseCase: new UpdateGameDiscountUseCase(gameRepository),
  deleteGameUseCase: new DeleteGameUseCase(gameRepository),
  gameRepository,
};
