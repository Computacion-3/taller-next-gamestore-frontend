import { ReactNode } from 'react';
import { BackgroundVideo } from '@/shared/presentation/components/BackgroundVideo';

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-blue-night">
      <BackgroundVideo />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
