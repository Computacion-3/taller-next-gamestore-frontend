'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { RealtimeStatusBadge } from '@/features/realtime/presentation/components/RealtimeStatusBadge';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';

const PRIMARY_NAV = [
  { label: 'TIENDA', href: '/' },
  { label: 'BIBLIOTECA', href: '/library' },
  { label: 'WISHLIST', href: '/wishlist' },
  { label: 'COMPRAS', href: '/purchases' },
];

const QUICK_ACCESS_NAV = [
  { label: 'Explorar Juegos', href: '/' },
  { label: 'Categorías', href: '/categories' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    router.push(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <header className="relative z-40 w-full bg-blue-cloud text-blue-night">
      {/* Barra superior global (estilo Steam): desaparece al hacer scroll hacia abajo */}
      <div className="border-b border-blue-sky/60 bg-blue-cloud">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.jpg"
                alt="GameStore logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg object-cover shadow"
                priority
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold leading-none tracking-wide text-blue-night">
                  GAMESTORE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-blue-night/70">
                  BUENO BONITO y BARAATO
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {PRIMARY_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`border-b-2 py-1 text-sm font-semibold tracking-wide transition ${
                      isActive
                        ? 'border-blue-night text-blue-night'
                        : 'border-transparent text-blue-night/60 hover:text-blue-star'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/users"
                  className={`border-b-2 py-1 text-sm font-semibold tracking-wide transition ${
                    pathname === '/users'
                      ? 'border-blue-night text-blue-night'
                      : 'border-transparent text-blue-night/60 hover:text-blue-star'
                  }`}
                >
                  USUARIOS
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/games"
                  className={`border-b-2 py-1 text-sm font-semibold tracking-wide transition ${
                    pathname.startsWith('/admin')
                      ? 'border-blue-night text-blue-night'
                      : 'border-transparent text-blue-night/60 hover:text-blue-star'
                  }`}
                >
                  ADMIN
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <RealtimeStatusBadge />
                <div className="hidden text-right text-xs sm:block">
                  <p className="font-semibold text-blue-night">{user.email}</p>
                  <p className="uppercase tracking-wider text-blue-night/75">
                    {user.role} · ${(user.walletBalance ?? 0).toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={isLoading}
                  className="rounded-md border border-blue-night/30 bg-white/60 px-3.5 py-2 text-xs font-semibold text-blue-night transition hover:border-blue-star hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 text-xs">
                <Link
                  href="/login"
                  className="rounded-md bg-blue-night px-4 py-2 font-semibold text-blue-cloud transition hover:bg-blue-star hover:text-white"
                >
                  Iniciar sesión
                </Link>
                <span className="text-blue-night/40">|</span>
                <Link
                  href="/register"
                  className="font-semibold text-blue-night/75 transition hover:text-blue-star"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-barra de accesos directos y buscador (estilo Steam) */}
      <div className="border-b border-blue-sky/30 bg-blue-night">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-2.5">
          <nav className="flex flex-wrap items-center gap-5 text-xs font-medium text-blue-cloud/90">
            {QUICK_ACCESS_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-blue-star"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/users"
                className="text-blue-sky transition hover:text-blue-cloud"
              >
                Gestión de Roles
              </Link>
            )}
          </nav>

          <form onSubmit={handleSearch} className="w-full sm:w-64">
            <div className="flex items-center overflow-hidden rounded-md border border-blue-sky/40 bg-blue-night/80 focus-within:border-blue-sky">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en la tienda..."
                aria-label="Buscar en la tienda"
                className="w-full bg-transparent px-3 py-1.5 text-xs text-blue-cloud placeholder-blue-cloud/60 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-sky px-3 py-1.5 text-xs font-semibold text-blue-night transition hover:bg-blue-cloud"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
