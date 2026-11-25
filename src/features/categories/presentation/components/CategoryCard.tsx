import Link from 'next/link';
import { buttonClasses } from '@/shared/presentation/components/ui/Button';
import { Card } from '@/shared/presentation/components/ui/Card';
import { Category } from '../../domain/entities/Category';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Card className="flex flex-col gap-3" data-testid="category-card">
      <h2 className="text-lg font-semibold text-white">{category.name}</h2>
      <p className="flex-1 text-sm text-blue-cloud/85">
        {category.description ?? 'Sin descripción.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href={`/categories/${category.id}`} className={buttonClasses('primary', 'sm')}>
          Ver juegos
        </Link>
        <Link href={`/?categoryId=${category.id}`} className={buttonClasses('secondary', 'sm')}>
          Filtrar en el catálogo
        </Link>
      </div>
    </Card>
  );
}