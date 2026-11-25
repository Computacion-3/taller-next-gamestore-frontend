'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUsers } from '@/features/users/presentation/hooks/useUsers';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { EmptyState } from '@/shared/presentation/components/ui/EmptyState';
import { useLibrary } from '../hooks/useLibrary';
import { LibraryGrid } from './LibraryGrid';

/** Vista de admin: biblioteca de cualquier usuario. Se renderiza dentro de RequireAuth. */
export function UserLibraryView() {
  const { id } = useParams<{ id: string }>();
  const { userLibrary, isLoading, error, fetchUserLibrary } = useLibrary();
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    if (id) void fetchUserLibrary(id);
  }, [id, fetchUserLibrary]);

  // Si se entra directo por URL, se cargan los usuarios para mostrar el correo
  useEffect(() => {
    if (users.length === 0) void fetchUsers();
  }, [users.length, fetchUsers]);

  const owner = users.find((user) => user.id === id);
  const backLink = (
    <Link href="/users" className={buttonClasses('secondary', 'sm')}>
      ← Volver a usuarios
    </Link>
  );

  if (error) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-lg border border-red-400/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
        {backLink}
      </div>
    );
  }
  if (isLoading || !userLibrary || userLibrary.userId !== id) {
    return <p className="text-sm text-slate-100">Cargando biblioteca...</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-100 drop-shadow">
        <span className="font-semibold">{owner?.email ?? 'Usuario'}</span> ·{' '}
        {userLibrary.items.length} {userLibrary.items.length === 1 ? 'juego' : 'juegos'}
      </p>
      {userLibrary.items.length === 0 ? (
        <EmptyState title="Este usuario todavía no tiene juegos" />
      ) : (
        <LibraryGrid items={userLibrary.items} />
      )}
      {backLink}
    </div>
  );
}