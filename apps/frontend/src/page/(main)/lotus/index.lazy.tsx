import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/boundary';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';
import { SuspenseLotusPagination } from '@/widget/lotusList/SuspenseLotusPagination';

const { useSearch } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page } = useSearch();

  return (
    <div>
      <LotusSearchBar />

      <AsyncBoundary pending={<SuspenseLotusList.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseLotusList page={page} />
      </AsyncBoundary>

      <AsyncBoundary pending={<SuspenseLotusPagination.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseLotusPagination page={page} />
      </AsyncBoundary>
    </div>
  );
}
