import { UserRole } from '@/features/auth/domain/entities/AuthUser';

const STYLES: Record<UserRole, string> = {
  admin: 'bg-blue-star text-blue-night',
  client: 'bg-blue-sky text-blue-night',
};

const LABELS: Record<UserRole, string> = {
  admin: 'ADMIN',
  client: 'CLIENT',
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      data-testid="role-badge"
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${STYLES[role]}`}
    >
      {LABELS[role]}
    </span>
  );
}
