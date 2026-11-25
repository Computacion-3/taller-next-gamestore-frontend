import { AuthSplitLayout } from '@/features/auth/presentation/components/AuthSplitLayout';
import { LoginForm } from '@/features/auth/presentation/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
