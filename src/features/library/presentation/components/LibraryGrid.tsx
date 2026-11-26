import { LibraryItem } from '../../domain/entities/LibraryItem';
import { LibraryGameCard } from './LibraryGameCard';

export function LibraryGrid({ items }: { items: LibraryItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <LibraryGameCard key={item.id} item={item} />
      ))}
    </div>
  );
}