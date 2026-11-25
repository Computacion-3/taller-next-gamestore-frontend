import Link from 'next/link';
import { getAuthoritiesForRole } from '@/features/auth/domain/entities/Authority';
import { UserAccount } from '../../domain/entities/UserAccount';
import { RoleBadge } from './RoleBadge';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormat = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

interface UsersTableProps {
  users: UserAccount[];
  /** Id del admin con sesión: su propia fila no se puede modificar. */
  currentUserId?: string;
  onChangeRole: (user: UserAccount) => void;
}

export function UsersTable({
  users,
  currentUserId,
  onChangeRole,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-sky/40 bg-blue-night/80 backdrop-blur-md">
      <table data-testid="users-table" className="w-full text-left text-sm">
        <caption className="sr-only">
          Usuarios registrados con su rol y permisos
        </caption>
        <thead className="border-b border-blue-sky/30 text-xs uppercase tracking-wider text-blue-sky">
          <tr>
            <th scope="col" className="px-4 py-3">Correo</th>
            <th scope="col" className="px-4 py-3">Rol</th>
            <th scope="col" className="px-4 py-3">Permisos</th>
            <th scope="col" className="px-4 py-3">Saldo</th>
            <th scope="col" className="px-4 py-3">Registro</th>
            <th scope="col" className="px-4 py-3 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-sky/15 text-blue-cloud">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const authorities = getAuthoritiesForRole(user.role);
            return (
              <tr
                key={user.id}
                data-testid={`user-row-${user.email}`}
                className="align-top"
              >
                <td className="px-4 py-3 font-medium">
                  {user.email}
                  {isSelf && (
                    <span className="ml-2 text-xs text-blue-sky">(tú)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-sky hover:text-blue-star">
                      {authorities.length} permisos
                    </summary>
                    <ul className="mt-2 space-y-0.5 text-blue-cloud/80">
                      {authorities.map((authority) => (
                        <li key={authority}>{authority}</li>
                      ))}
                    </ul>
                  </details>
                </td>
                <td className="px-4 py-3">
                  {currency.format(user.walletBalance)}
                </td>
                <td className="px-4 py-3 text-blue-cloud/80">
                  {user.createdAt ? dateFormat.format(user.createdAt) : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/users/${user.id}/library`}
                      data-testid={`user-library-${user.email}`}
                      className="rounded-md border border-blue-sky/50 px-3 py-1.5 text-xs font-semibold transition hover:border-blue-star hover:text-blue-star"
                    >
                      Biblioteca
                    </Link>
                    <button
                      type="button"
                      data-testid={`change-role-${user.email}`}
                      onClick={() => onChangeRole(user)}
                      disabled={isSelf}
                      title={
                        isSelf
                          ? 'No puedes cambiar tu propio rol'
                          : 'Cambiar rol'
                      }
                      className="rounded-md border border-blue-sky/50 px-3 py-1.5 text-xs font-semibold transition hover:border-blue-star hover:text-blue-star disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-blue-sky/50 disabled:hover:text-blue-cloud"
                    >
                      Cambiar rol
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
