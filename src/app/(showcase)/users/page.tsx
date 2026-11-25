import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { UsersAdminPanel } from '@/features/users/presentation/components/UsersAdminPanel';

export default function UsersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth authority="users:manage">
        <UsersAdminPanel />
      </RequireAuth>
    </main>
  );
}
