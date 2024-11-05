import { Button } from '@froxy/design/button';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <Button onClick={() => alert('hello')}>Hello</Button>
      <h1 className="text-red-300">hello world</h1>
    </div>
  );
}
