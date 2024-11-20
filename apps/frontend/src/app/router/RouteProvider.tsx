import { RouterProvider as Provider, createRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { routeTree } from '@/app/router/routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function RouteProvider() {
  return (
    <>
      <Provider router={router} />
      {import.meta.env.DEV && <TanStackRouterDevtools router={router} />}
    </>
  );
}
