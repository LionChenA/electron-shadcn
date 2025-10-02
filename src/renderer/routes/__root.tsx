import { createRootRoute, Outlet } from '@tanstack/react-router';
import BaseLayout from '@/renderer/layouts/BaseLayout';

export const RootRoute = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}
