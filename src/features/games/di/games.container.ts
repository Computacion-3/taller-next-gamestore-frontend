import { tokenStorage } from '../../auth/infrastructure/storage/tokenStorage';
import { GetGamesUseCase } from '../domain/usecases/GetGamesUseCase';
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
  gameRepository,
};
