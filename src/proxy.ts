import { NextRequest, NextResponse } from 'next/server';
import {
  Authority,
  getAuthoritiesForRole,
} from '@/features/auth/domain/entities/Authority';
import {
  decodeJwtClaims,
  isJwtExpired,
} from '@/features/auth/infrastructure/jwt/jwtClaims';

/**
 * Guard de rutas (Next.js 16: proxy.ts, antes middleware.ts).
 *
 * - Rutas privadas sin sesión válida  -> /login?redirect=<ruta>
 * - Rutas con authority requerida     -> /forbidden si el rol no la tiene
 * - /login y /register con sesión     -> /
 *
 * La sesión se lee de la cookie que escribe tokenStorage. Solo se DECODIFICA
 * el JWT (no se verifica la firma): esto mejora la experiencia de navegación,
 * pero la seguridad real la aplica el backend (JwtAuthGuard + RolesGuard).
 */
const TOKEN_COOKIE = 'gamestore_jwt_token';

interface RouteRule {
  prefix: string;
  authority?: Authority;
}

const PRIVATE_ROUTES: RouteRule[] = [
  { prefix: '/library' },
  { prefix: '/wishlist' },
  { prefix: '/purchases' },
  { prefix: '/profile' },
  { prefix: '/users', authority: 'users:manage' },
];

const GUEST_ONLY_ROUTES = ['/login', '/register'];

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function readToken(request: NextRequest): string | null {
  const raw = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = readToken(request);
  const claims = decodeJwtClaims(token);
  const hasValidSession = claims !== null && !isJwtExpired(claims);

  if (GUEST_ONLY_ROUTES.some((route) => matches(pathname, route))) {
    if (hasValidSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const rule = PRIVATE_ROUTES.find((r) => matches(pathname, r.prefix));
  if (!rule) {
    return NextResponse.next();
  }

  if (!hasValidSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Cookie vencida o ilegible: se elimina para no arrastrar una sesión muerta.
      response.cookies.delete(TOKEN_COOKIE);
    }
    return response;
  }

  if (
    rule.authority &&
    !getAuthoritiesForRole(claims.role).includes(rule.authority)
  ) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/library/:path*',
    '/wishlist/:path*',
    '/purchases/:path*',
    '/profile/:path*',
    '/users/:path*',
    '/login',
    '/register',
  ],
};
