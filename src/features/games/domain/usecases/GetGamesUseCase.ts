import { Game } from '../entities/Game';
import { GameRepository, GetGamesParams } from '../repositories/GameRepository';

export class GetGamesUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(params?: GetGamesParams): Promise<Game[]> {
    return this.gameRepository.getAll(params);
  }
}
