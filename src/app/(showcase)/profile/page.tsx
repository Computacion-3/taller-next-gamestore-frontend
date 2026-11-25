import { RequireAuth } from '@/features/auth/presentation/components/RequireAuth';
import { ProfilePanel } from '@/features/users/presentation/components/ProfilePanel';

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <RequireAuth>
        <ProfilePanel />
      </RequireAuth>
    </main>
  );
}
