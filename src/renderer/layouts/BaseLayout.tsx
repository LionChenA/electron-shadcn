import type React from 'react';
import DragWindowRegion from '@/renderer/components/DragWindowRegion';
import NavigationMenu from '@/renderer/components/NavigationMenu';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DragWindowRegion title="electron-shadcn" />
      <NavigationMenu />
      <main className="h-screen p-2 pb-20">{children}</main>
    </>
  );
}
