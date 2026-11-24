'use client';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md bg-blue-night px-3.5 py-2 text-xs font-semibold text-blue-cloud shadow transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`h-8 w-8 rounded-md text-xs font-bold shadow transition ${
              isCurrent
                ? 'bg-blue-star text-white'
                : 'bg-blue-cloud text-blue-night hover:bg-blue-sky'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md bg-blue-night px-3.5 py-2 text-xs font-semibold text-blue-cloud shadow transition hover:bg-blue-star hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
      </button>
    </nav>
  );
}
