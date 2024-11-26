import { Suspense } from 'react';
import { createLazyFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router';
import { lotusQueryOptions } from '@/feature/lotus';
import { ErrorBoundary } from '@/shared/boundary';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';
import { SuspenseLotusPagination } from '@/widget/lotusList/SuspenseLotusPagination';

const { useSearch } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page } = useSearch();
  const navigate = useNavigate();

  const lotusListQueryOptions = lotusQueryOptions.list({ page });

  const onChangePage = (page: number = 1) => navigate({ to: '/lotus', search: { page } });

  return (
    <div>
      <LotusSearchBar />

      <ErrorBoundary
        fallback={({ error, reset }) => (
          <SuspenseLotusList.ErrorFallback error={error} retry={reset} onChangePage={onChangePage} />
        )}
      >
        <Suspense fallback={<SuspenseLotusList.Skeleton />}>
          <SuspenseLotusList queryOptions={lotusListQueryOptions} />
        </Suspense>

        <Suspense fallback={<SuspenseLotusPagination.Skeleton />}>
          <SuspenseLotusPagination queryOptions={lotusListQueryOptions} onChangePage={onChangePage} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
