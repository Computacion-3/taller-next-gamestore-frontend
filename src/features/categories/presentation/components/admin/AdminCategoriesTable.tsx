import Link from 'next/link';
import { Can } from '@/features/auth/presentation/components/Can';
import { Button } from '@/shared/presentation/components/ui/Button';
import { Category } from '../../../domain/entities/Category';

export interface AdminCategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function AdminCategoriesTable({ categories, onEdit, onDelete }: AdminCategoriesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-sky/40 bg-blue-night/80 backdrop-blur-md">
      <table data-testid="admin-categories-table" className="w-full text-left text-sm">
        <caption className="sr-only">Categorías de la tienda</caption>
        <thead className="border-b border-blue-sky/30 text-xs uppercase tracking-wider text-blue-sky">
          <tr>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Descripción</th>
            <th scope="col" className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-sky/15 text-blue-cloud">
          {categories.map((category) => (
            <tr key={category.id} data-testid={`admin-category-row-${category.name}`} className="align-top">
              <td className="px-4 py-3">
                <Link href={`/categories/${category.id}`} className="font-semibold text-white hover:text-blue-star">
                  {category.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-blue-cloud/80">{category.description || '—'}</td>
              <td className="px-4 py-3">
                <Can authority="categories:manage">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(category)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(category)}>
                      Eliminar
                    </Button>
                  </div>
                </Can>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}