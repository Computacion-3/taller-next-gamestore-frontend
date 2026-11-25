import {
  AuthResponseDto,
  LoginRequestDto,
  LogoutResponseDto,
  ProfileResponseDto,
  RegisterRequestDto,
} from '../dtos/AuthDto';
import { AuthDatasource } from './AuthDatasource';

export class AuthRestDatasource implements AuthDatasource {
  private readonly baseUrl: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    private readonly getToken?: () => string | null,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildHeaders(includeAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async extractErrorMessage(
    response: Response,
    fallback: string,
  ): Promise<string> {
    try {
      const body = (await response.json()) as {
        message?: string | string[];
      };
      if (Array.isArray(body.message)) {
        return body.message.join('. ');
      }
      if (typeof body.message === 'string') {
        return body.message;
      }
    } catch {
      // Ignore JSON parse error
    }
    return fallback;
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.buildHeaders(false),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const msg = await this.extractErrorMessage(
        response,
        'Credenciales inválidas. Verifica tu correo y contraseña.',
      );
      throw new Error(msg);
    }

    return response.json();
  }

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.buildHeaders(false),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const msg = await this.extractErrorMessage(
        response,
        'No se pudo registrar la cuenta.',
      );
      throw new Error(msg);
    }

    return response.json();
  }

  async logout(): Promise<LogoutResponseDto> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: this.buildHeaders(true),
    });

    if (!response.ok && response.status !== 401) {
      const msg = await this.extractErrorMessage(
        response,
        'Error al cerrar sesión en el servidor.',
      );
      throw new Error(msg);
    }

    try {
      return await response.json();
    } catch {
      return { message: 'Sesión cerrada exitosamente' };
    }
  }

  async getProfile(): Promise<ProfileResponseDto> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: this.buildHeaders(true),
    });

    if (!response.ok) {
      const msg = await this.extractErrorMessage(
        response,
        'Tu sesión ha expirado. Inicia sesión nuevamente.',
      );
      throw new Error(msg);
    }

    return response.json();
  }
}
