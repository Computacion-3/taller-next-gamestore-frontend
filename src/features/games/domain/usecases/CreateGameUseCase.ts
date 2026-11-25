import { Game } from '../entities/Game';
import {
  CreateGameParams,
  GameRepository,
} from '../repositories/GameRepository';

export class CreateGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(params: CreateGameParams): Promise<Game> {
    if (!params.title || params.title.trim().length === 0) {
      throw new Error('El título del videojuego es obligatorio.');
    }
    if (!params.developer || params.developer.trim().length === 0) {
      throw new Error('El desarrollador es obligatorio.');
    }
    if (!params.description || params.description.trim().length === 0) {
      throw new Error('La descripción es obligatoria.');
    }
    if (Number.isNaN(params.releaseDate.getTime())) {
      throw new Error('La fecha de lanzamiento no es válida.');
    }
    if (params.originalPrice < 0) {
      throw new Error('El precio base no puede ser negativo.');
    }
    if (
      params.discount !== undefined &&
      (params.discount < 0 || params.discount > 100)
    ) {
      throw new Error('El descuento debe estar entre 0 y 100.');
    }
    return this.gameRepository.create(params);
  }
}
