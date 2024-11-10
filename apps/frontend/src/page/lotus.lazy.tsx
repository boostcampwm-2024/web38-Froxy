import { Button } from '@froxy/design/components';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LotusCard } from '@/widget/LotusCard';

export const Route = createLazyFileRoute('/lotus')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <Button onClick={() => alert('Lotus')}>Lotus</Button>
      <h1 className="text-red-300">Lotus world</h1>
      <LotusCard />
    </div>
  );
}
