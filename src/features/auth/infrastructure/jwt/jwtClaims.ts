import type { UserRole } from '../../domain/entities/AuthUser';

/**
 * Lectura de los claims del JWT (sub, email, role, exp).
 *
 * IMPORTANTE: solo DECODIFICA el payload, no verifica la firma (el secreto vive
 * en el backend). Sirve para decidir la interfaz (qué rutas y acciones mostrar);
 * la seguridad real la aplica el backend con JwtAuthGuard + RolesGuard.
 *
 * No usa APIs de navegador exclusivas (window, localStorage), así que también
 * funciona en proxy.ts.
 */
export interface JwtClaims {
  sub: string;
  email: string;
  role: UserRole;
  exp?: number;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwtClaims(
  token: string | null | undefined,
): JwtClaims | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const raw = JSON.parse(base64UrlDecode(parts[1])) as Partial<JwtClaims>;
    if (
      typeof raw.sub !== 'string' ||
      (raw.role !== 'admin' && raw.role !== 'client')
    ) {
      return null;
    }
    return {
      sub: raw.sub,
      email: typeof raw.email === 'string' ? raw.email : '',
      role: raw.role,
      exp: typeof raw.exp === 'number' ? raw.exp : undefined,
    };
  } catch {
    return null;
  }
}

export function isJwtExpired(claims: JwtClaims, nowMs = Date.now()): boolean {
  return claims.exp !== undefined && claims.exp * 1000 <= nowMs;
}
