export interface CategoryProps {
  id: string;
  name: string;
  description: string | null;
  createdAt?: Date;
}

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly createdAt?: Date;

  constructor(props: CategoryProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('El nombre de la categoría es obligatorio.');
    }
    this.id = props.id;
    this.name = props.name.trim();
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
  }
}
