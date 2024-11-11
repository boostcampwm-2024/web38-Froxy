import { Button } from '@froxy/design/components';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LotusCardList } from '@/widget/LotusList/LotusCardList';
import { LotusSearchBar } from '@/widget/LotusList/LotusSearchBar';

export const Route = createLazyFileRoute('/lotus')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <Button onClick={() => alert('Lotus')}>Lotus</Button>
      <h1 className="text-red-300">Lotus world</h1>
      <LotusSearchBar />
      <LotusCardList />
    </div>
  );
}
