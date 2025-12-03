import type React from 'react';
import DragWindowRegion from '@/components/DragWindowRegion';
import LangToggle from '@/components/LangToggle';
import ToggleTheme from '@/components/ToggleTheme';
import { Updater } from '@/components/Updater';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DragWindowRegion title="electron-shadcn" />
      <main className="h-screen p-2 pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-t bg-background px-4">
        <div className="flex items-center space-x-2">
          <Updater />
        </div>
        <div className="flex items-center space-x-2">
          <LangToggle />
          <ToggleTheme />
        </div>
      </footer>
    </>
  );
}
