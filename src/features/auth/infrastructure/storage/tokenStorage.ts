import { AuthUserDto } from '../dtos/AuthDto';

const TOKEN_KEY = 'gamestore_jwt_token';
const USER_KEY = 'gamestore_auth_user';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  getUser(): AuthUserDto | null;
  setUser(user: AuthUserDto): void;
  clear(): void;
}

export const tokenStorage: TokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  },

  getUser(): AuthUserDto | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUserDto;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUserDto): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  },
};
