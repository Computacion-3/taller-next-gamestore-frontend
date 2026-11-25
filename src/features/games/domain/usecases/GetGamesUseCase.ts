import {
  GameRepository,
  GetGamesParams,
  PaginatedGames,
} from '../repositories/GameRepository';

export const MAX_GAMES_PER_PAGE = 50;

export class GetGamesUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(params: GetGamesParams = {}): Promise<PaginatedGames> {
    if (
      params.page !== undefined &&
      (!Number.isInteger(params.page) || params.page < 1)
    ) {
      throw new Error('La página debe ser un número entero mayor o igual a 1.');
    }
    if (
      params.limit !== undefined &&
      (!Number.isInteger(params.limit) ||
        params.limit < 1 ||
        params.limit > MAX_GAMES_PER_PAGE)
    ) {
      throw new Error(
        `El tamaño de página debe estar entre 1 y ${MAX_GAMES_PER_PAGE}.`,
      );
    }

    const search = params.search?.trim();
    return this.gameRepository.getAll({ ...params, search: search || undefined });
  }
}