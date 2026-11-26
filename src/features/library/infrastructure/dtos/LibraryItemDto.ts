import { GameDto } from '@/features/games/infrastructure/dtos/GameDto';

export interface LibraryItemDto {
  id: string;
  game: GameDto;
  acquisitionDate: string;
}