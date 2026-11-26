import type { Metadata } from 'next';
import { WishlistView } from '@/features/wishlist/presentation/components/WishlistView';
import { PageHeader } from '@/shared/presentation/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Mi Wishlist · GameStore' };

export default function WishlistPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 text-slate-100">
      <PageHeader
        title="Mi Wishlist"
        subtitle="Tus juegos guardados y las alertas de precio en tiempo real."
      />
      <WishlistView />
    </main>
  );
}