import { PurchaseStatus } from '../../domain/entities/Purchase';

const LABELS: Record<PurchaseStatus, string> = {
  completed: 'Completada',
  pending: 'Pendiente',
  failed: 'Fallida',
};

const STYLES: Record<PurchaseStatus, string> = {
  completed: 'bg-emerald-600 text-white',
  pending: 'bg-amber-400 text-blue-night',
  failed: 'bg-red-600 text-white',
};

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}