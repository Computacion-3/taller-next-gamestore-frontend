import { UserRole } from '../../domain/entities/AuthUser';
import { AuthUserDto } from '../../infrastructure/dtos/AuthDto';

export interface AuthState {
  user: AuthUserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

type Listener = (state: AuthState) => void;

class AuthStore {
  private state: AuthState = { ...initialAuthState };
  private readonly listeners = new Set<Listener>();

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(next: AuthState): void {
    this.state = next;
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setLoading(isLoading: boolean): void {
    this.emit({ ...this.state, isLoading, error: null });
  }

  setSession(token: string, user: AuthUserDto): void {
    this.emit({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  setError(error: string | null): void {
    this.emit({ ...this.state, isLoading: false, error });
  }

  reset(): void {
    this.emit({ ...initialAuthState });
  }

  hasRole(role: UserRole): boolean {
    return this.state.user?.role === role;
  }
}

export const authStore = new AuthStore();
