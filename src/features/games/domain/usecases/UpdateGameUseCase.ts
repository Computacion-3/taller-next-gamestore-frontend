import { Game } from '../entities/Game';
import {
  GameRepository,
  UpdateGameParams,
} from '../repositories/GameRepository';

export class UpdateGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(id: string, params: UpdateGameParams): Promise<Game> {
    if (!id || id.trim().length === 0) {
      throw new Error('El identificador del videojuego es obligatorio.');
    }
    if (params.title !== undefined && params.title.trim().length === 0) {
      throw new Error('El título del videojuego no puede quedar vacío.');
    }
    if (params.releaseDate !== undefined && Number.isNaN(params.releaseDate.getTime())) {
      throw new Error('La fecha de lanzamiento no es válida.');
    }
    if (params.originalPrice !== undefined && params.originalPrice < 0) {
      throw new Error('El precio base no puede ser negativo.');
    }
    return this.gameRepository.update(id, params);
  }
}
