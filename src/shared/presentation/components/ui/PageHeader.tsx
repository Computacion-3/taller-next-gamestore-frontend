import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

/** Encabezado de página con el mismo estilo del catálogo. */
export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white drop-shadow">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-100 drop-shadow">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}