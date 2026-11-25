import { GameMapper } from '@/features/games/infrastructure/mappers/GameMapper';
import { LibraryItem } from '../../domain/entities/LibraryItem';
import { LibraryItemDto } from '../dtos/LibraryItemDto';

export class LibraryMapper {
  static toDomain(dto: LibraryItemDto): LibraryItem {
    return new LibraryItem({
      id: dto.id,
      game: GameMapper.toDomain(dto.game),
      acquisitionDate: new Date(dto.acquisitionDate),
    });
  }
}