import { UserRole } from '@/features/auth/domain/entities/AuthUser';

export interface UserAccountProps {
  id: string;
  email: string;
  walletBalance: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserAccount {
  public readonly id: string;
  public readonly email: string;
  public readonly walletBalance: number;
  public readonly role: UserRole;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: UserAccountProps) {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('El correo electrónico del usuario no es válido.');
    }
    this.id = props.id;
    this.email = props.email.trim().toLowerCase();
    this.walletBalance = Number(props.walletBalance ?? 0);
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
}
