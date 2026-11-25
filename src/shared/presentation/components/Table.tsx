import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  /** Identificador estable para pruebas E2E. */
  testId?: string;
}

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const SKELETON_ROWS = 4;

/** Tabla genérica y reutilizable con estados de carga y vacío. */
export function Table<T>({
  columns,
  rows,
  getRowKey,
  caption,
  isLoading = false,
  emptyMessage = 'No hay registros para mostrar.',
  testId = 'table',
}: TableProps<T>) {
  return (
    <div
      data-cy={testId}
      className="overflow-x-auto rounded-2xl border border-blue-sky/40 bg-blue-night/80 backdrop-blur-md"
    >
      <table className="w-full min-w-[32rem] border-collapse text-sm text-blue-cloud">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-blue-sky/30 bg-blue-sky/10">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-blue-star ${ALIGN_CLASSES[column.align ?? 'left']}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <tr
                key={`skeleton-${index}`}
                aria-hidden="true"
                className="border-b border-blue-sky/20"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <div className="h-4 animate-pulse rounded bg-blue-sky/20" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                data-cy={`${testId}-empty`}
                className="px-4 py-10 text-center text-blue-cloud/60"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                data-cy={`${testId}-row`}
                className="border-b border-blue-sky/20 transition last:border-b-0 hover:bg-blue-sky/10"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 ${ALIGN_CLASSES[column.align ?? 'left']} ${column.className ?? ''}`}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
