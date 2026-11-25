'use client';

import { useEffect, useMemo, useState } from 'react';
import { UserRole } from '@/features/auth/domain/entities/AuthUser';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { useToasts } from '@/shared/presentation/hooks/useToasts';
import { UserAccount } from '../../domain/entities/UserAccount';
import { useUsers } from '../hooks/useUsers';
import { ChangeRoleDialog } from './ChangeRoleDialog';
import { UsersTable } from './UsersTable';

type RoleFilter = 'all' | UserRole;

export function UsersAdminPanel() {
  const { users, isLoading, error, fetchUsers, updateUserRole } = useUsers();
  const { user: me } = useAuth();
  const { notify } = useToasts();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [target, setTarget] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === 'all' || u.role === roleFilter) &&
        (term === '' || u.email.includes(term)),
    );
  }, [users, search, roleFilter]);

  const admins = users.filter((u) => u.role === 'admin').length;

  const closeDialog = () => {
    setTarget(null);
    setDialogError(null);
  };

  const handleConfirm = async (role: UserRole) => {
    if (!target) return;
    setIsSubmitting(true);
    setDialogError(null);
    try {
      const updated = await updateUserRole(target.id, role);
      setTarget(null);
      notify(
        'success',
        'Rol actualizado',
        `${updated.email} ahora es ${role === 'admin' ? 'administrador' : 'cliente'}.`,
      );
    } catch (err) {
      // El error se muestra dentro del diálogo (un toast quedaría tapado por el modal).
      setDialogError(
        err instanceof Error ? err.message : 'No se pudo cambiar el rol.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="users-title">
      <div className="mb-6">
        <h1 id="users-title" className="text-2xl font-bold text-white drop-shadow">
          Gestión de usuarios y roles
        </h1>
        <p className="mt-1 text-sm text-slate-100 drop-shadow">
          Consulta las cuentas, sus permisos y cambia el rol de otros usuarios.
        </p>
      </div>

      <dl className="mb-6 grid grid-cols-3 gap-3 text-center">
        {[
          ['Total', users.length],
          ['Administradores', admins],
          ['Clientes', users.length - admins],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-blue-sky/40 bg-blue-night/80 px-3 py-3 backdrop-blur-md"
          >
            <dt className="text-xs uppercase tracking-wider text-blue-sky">
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-blue-cloud">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por correo..."
          aria-label="Buscar usuarios por correo"
          data-testid="users-search"
          className="w-full rounded-md border border-blue-sky/40 bg-blue-night/80 px-3 py-2 text-sm text-blue-cloud placeholder-blue-cloud/60 focus:border-blue-sky focus:outline-none sm:w-72"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          aria-label="Filtrar por rol"
          className="rounded-md border border-blue-sky/40 bg-blue-night/80 px-3 py-2 text-sm text-blue-cloud focus:border-blue-sky focus:outline-none"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="client">Clientes</option>
        </select>
      </div>

      {isLoading && users.length === 0 && (
        <p role="status" className="text-sm text-slate-100">
          Cargando usuarios...
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-400/60 bg-red-500/15 px-4 py-3 text-sm text-red-200"
        >
          {error}{' '}
          <button
            type="button"
            onClick={() => void fetchUsers()}
            className="ml-2 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="rounded-xl border border-blue-sky/40 bg-blue-night/80 p-6 text-center text-sm text-blue-cloud">
          No hay usuarios que coincidan con la búsqueda.
        </p>
      )}

      {filtered.length > 0 && (
        <UsersTable
          users={filtered}
          currentUserId={me?.id}
          onChangeRole={(user) => {
            setDialogError(null);
            setTarget(user);
          }}
        />
      )}

      <ChangeRoleDialog
        user={target}
        isSubmitting={isSubmitting}
        error={dialogError}
        onConfirm={(role) => void handleConfirm(role)}
        onClose={closeDialog}
      />
    </section>
  );
}
