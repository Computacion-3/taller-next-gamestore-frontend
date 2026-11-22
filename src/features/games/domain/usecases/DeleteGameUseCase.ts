import { GameRepository } from '../repositories/GameRepository';

export class DeleteGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('El identificador del videojuego es obligatorio.');
    }
    await this.gameRepository.delete(id);
  }
}
