import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Parte superior: columnas de navegación y contexto del proyecto */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.jpg"
                alt="GameStore logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-base font-extrabold tracking-wide text-white">
                GAMESTORE
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Plataforma digital de videojuegos construida con Next.js App
              Router, Clean Architecture (Feature-First), Redux Toolkit,
              WebSockets y soporte dual REST / GraphQL.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Módulos de la Tienda
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-blue-star">
                  Catálogo de Juegos
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="transition hover:text-blue-star"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="transition hover:text-blue-star"
                >
                  Mi Biblioteca
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="transition hover:text-blue-star"
                >
                  Lista de Deseos
                </Link>
              </li>
              <li>
                <Link
                  href="/purchases"
                  className="transition hover:text-blue-star"
                >
                  Historial de Compras
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Cuenta y Acceso
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-blue-star"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-blue-star"
                >
                  Crear Cuenta
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="transition hover:text-blue-star"
                >
                  Gestión de Usuarios
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador y barra legal inferior (estilo Steam) */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © 2026 GameStore · Computación en Internet III — Universidad ICESI.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Arquitectura Limpia</span>
            <span className="text-slate-700">|</span>
            <span>JWT &amp; Authorities</span>
            <span className="text-slate-700">|</span>
            <span>REST / GraphQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
