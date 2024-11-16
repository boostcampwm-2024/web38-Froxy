import { createLazyFileRoute } from '@tanstack/react-router';
import { LotusCardList } from '@/widget/LotusList/LotusCardList';
import { LotusSearchBar } from '@/widget/LotusList/LotusSearchBar';

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8">
      <LotusSearchBar />
      <LotusCardList />
    </div>
  );
}
