export interface GameProps {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  developer: string;
  releaseDate: Date;
  coverImage: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Game {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly price: number;
  public readonly originalPrice: number;
  public readonly discount: number;
  public readonly developer: string;
  public readonly releaseDate: Date;
  public readonly coverImage: string | null;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: GameProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('El título del videojuego es obligatorio.');
    }
    if (props.originalPrice < 0) {
      throw new Error('El precio original no puede ser negativo.');
    }
    if (props.discount < 0 || props.discount > 100) {
      throw new Error('El descuento debe estar entre 0 y 100.');
    }

    this.id = props.id;
    this.title = props.title.trim();
    this.description = props.description;
    this.price = props.price;
    this.originalPrice = props.originalPrice;
    this.discount = props.discount;
    this.developer = props.developer;
    this.releaseDate = props.releaseDate;
    this.coverImage = props.coverImage;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get hasDiscount(): boolean {
    return this.discount > 0;
  }
    /** Precio final con otro descuento (misma fórmula y redondeo del backend). */
  priceWithDiscount(discount: number): number {
    const value = this.originalPrice * (1 - discount / 100);
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
