import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusQueryOptions } from '@/feature/lotus';
import { AsyncBoundary } from '@/shared/boundary';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';
import { SuspenseLotusPagination } from '@/widget/lotusList/SuspenseLotusPagination';

const { useSearch } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page } = useSearch();

  const lotusListQueryOptions = lotusQueryOptions.list({ page });

  return (
    <div>
      <LotusSearchBar />

      <AsyncBoundary pending={<SuspenseLotusList.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseLotusList queryOptions={lotusListQueryOptions} />
      </AsyncBoundary>

      <AsyncBoundary pending={<SuspenseLotusPagination.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseLotusPagination queryOptions={lotusListQueryOptions} />
      </AsyncBoundary>
    </div>
  );
}
