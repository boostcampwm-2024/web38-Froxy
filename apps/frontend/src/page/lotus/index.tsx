import { createFileRoute } from '@tanstack/react-router';
import { LotusCardList } from '@/widget/LotusList/LotusCardList';
import { LotusPagination } from '@/widget/LotusList/LotusPagination';
import { LotusSearchBar } from '@/widget/LotusList/LotusSearchBar';

export const Route = createFileRoute('/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8">
      <LotusSearchBar />
      <LotusCardList />
      <LotusPagination totalPages={10} onChangePage={(page) => console.log(page)} />
    </div>
  );
}
