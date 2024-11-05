import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: RouteComponent
});

function RouteComponent() {
  return 'Hello /about!';
}
