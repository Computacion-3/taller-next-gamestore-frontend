import { UserRole } from './AuthUser';

export type Authority =
  | 'games:read'
  | 'games:create'
  | 'games:update'
  | 'games:delete'
  | 'games:discount'
  | 'categories:read'
  | 'categories:manage'
  | 'wishlist:manage'
  | 'library:read'
  | 'purchases:create'
  | 'purchases:view_all'
  | 'users:manage';

const CLIENT_AUTHORITIES: readonly Authority[] = [
  'games:read',
  'categories:read',
  'wishlist:manage',
  'library:read',
  'purchases:create',
];

const ADMIN_AUTHORITIES: readonly Authority[] = [
  ...CLIENT_AUTHORITIES,
  'games:create',
  'games:update',
  'games:delete',
  'games:discount',
  'categories:manage',
  'purchases:view_all',
  'users:manage',
];

export function getAuthoritiesForRole(role: UserRole): Authority[] {
  return role === 'admin' ? [...ADMIN_AUTHORITIES] : [...CLIENT_AUTHORITIES];
}
