import { Game } from '../entities/Game';
import { GameRepository } from '../repositories/GameRepository';

export class GetGameByIdUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(id: string): Promise<Game> {
    if (!id || id.trim().length === 0) {
      throw new Error('El identificador del videojuego es obligatorio.');
    }
    return this.gameRepository.getById(id);
  }
}
