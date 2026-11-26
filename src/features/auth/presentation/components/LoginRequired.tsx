import Link from 'next/link';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { Card } from '@/shared/presentation/components/ui/Card';

export function LoginRequired({
  message = 'Inicia sesión para ver esta sección.',
}: {
  message?: string;
}) {
  return (
    <Card className="text-center">
      <p className="text-sm text-blue-cloud">{message}</p>
      <Link href="/login" className={`mt-4 ${buttonClasses('primary', 'sm')}`}>
        Iniciar sesión
      </Link>
    </Card>
  );
}