export type UserRole = 'admin' | 'client';

export interface AuthUserProps {
  id: string;
  email: string;
  role: UserRole;
  walletBalance?: number;
}

export class AuthUser {
  public readonly id: string;
  public readonly email: string;
  public readonly role: UserRole;
  public readonly walletBalance: number;

  constructor(props: AuthUserProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('El identificador del usuario es obligatorio.');
    }
    if (!props.email || props.email.trim().length === 0) {
      throw new Error('El correo electrónico del usuario es obligatorio.');
    }

    this.id = props.id;
    this.email = props.email.trim().toLowerCase();
    this.role = props.role;
    this.walletBalance = Number(props.walletBalance ?? 0);
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}
