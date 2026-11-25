import { AccessDenied } from '@/features/auth/presentation/components/AccessDenied';

export default function ForbiddenPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6">
      <AccessDenied variant="forbidden" />
    </main>
  );
}
