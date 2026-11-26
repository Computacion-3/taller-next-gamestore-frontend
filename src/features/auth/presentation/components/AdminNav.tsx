'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Authority } from '../../domain/entities/Authority';
import { Can } from './Can';

const ADMIN_LINKS: Array<{ href: string; label: string; authority: Authority }> = [
  { href: '/admin/games', label: 'Juegos', authority: 'games:create' },
  { href: '/admin/categories', label: 'Categorías', authority: 'categories:manage' },
  { href: '/users', label: 'Usuarios', authority: 'users:manage' },
  { href: '/purchases/all', label: 'Compras', authority: 'purchases:view_all' },
];

/** Pestañas del área de administración; cada una se muestra solo con su authority. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administración" className="mb-6 flex flex-wrap gap-2">
      {ADMIN_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Can key={link.href} authority={link.authority}>
            <Link
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-sky text-blue-night'
                  : 'border border-blue-sky/50 text-blue-cloud hover:border-blue-star hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          </Can>
        );
      })}
    </nav>
  );
}