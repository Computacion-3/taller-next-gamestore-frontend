import Link from 'next/link';

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <section
      data-cy="empty-state"
      className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-blue-sky/50 bg-blue-night/70 p-10 text-center backdrop-blur-md"
    >
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-blue-cloud/75">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-blue-star px-4 py-2 text-sm font-semibold text-blue-night transition hover:bg-blue-cloud"
        >
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
