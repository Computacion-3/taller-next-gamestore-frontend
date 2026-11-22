import { Game } from '@/features/games/domain/entities/Game';

export interface LibraryItemProps {
  id: string;
  game: Game;
  acquisitionDate: Date;
}

export class LibraryItem {
  public readonly id: string;
  public readonly game: Game;
  public readonly acquisitionDate: Date;

  constructor(props: LibraryItemProps) {
    if (!props.id) {
      throw new Error('El identificador del ítem de biblioteca es obligatorio.');
    }
    this.id = props.id;
    this.game = props.game;
    this.acquisitionDate = props.acquisitionDate;
  }
}
