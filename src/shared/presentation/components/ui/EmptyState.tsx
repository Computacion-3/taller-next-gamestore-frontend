import Link from 'next/link';
import { buttonClasses } from './Button';
import { Card } from './Card';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      {description && <p className="mt-1 text-sm text-blue-cloud/80">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className={`mt-4 ${buttonClasses('primary', 'sm')}`}>
          {actionLabel}
        </Link>
      )}
    </Card>
  );
}