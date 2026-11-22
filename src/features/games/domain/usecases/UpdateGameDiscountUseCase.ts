import { Game } from '../entities/Game';
import { GameRepository } from '../repositories/GameRepository';

export class UpdateGameDiscountUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(id: string, discount: number): Promise<Game> {
    if (!id || id.trim().length === 0) {
      throw new Error('El identificador del videojuego es obligatorio.');
    }
    if (discount < 0 || discount > 100) {
      throw new Error('El descuento debe estar entre 0 y 100.');
    }
    return this.gameRepository.updateDiscount(id, discount);
  }
}
