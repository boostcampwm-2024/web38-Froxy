import { Suspense } from 'react';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusQueryOptions } from '@/feature/lotus';
import { ErrorBoundary } from '@/shared/boundary';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';
import { SuspensePagination } from '@/widget/SuspensePagination';

const { useSearch, useNavigate } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page, keyword } = useSearch();
  const navigate = useNavigate();

  const lotusListQueryOptions = lotusQueryOptions.list({ page, keyword });

  const onChangePage = (page: number = 1) => navigate({ to: '/lotus', search: { page } });

  return (
    <div>
      <LotusSearchBar current={keyword} />

      <ErrorBoundary
        fallback={({ error, reset }) => (
          <SuspenseLotusList.Error error={error} retry={reset} onChangePage={onChangePage} />
        )}
      >
        <Suspense fallback={<SuspenseLotusList.Skeleton />}>
          <SuspenseLotusList queryOptions={lotusListQueryOptions} />
        </Suspense>

        <Suspense fallback={<SuspensePagination.Skeleton />}>
          <SuspensePagination queryOptions={lotusListQueryOptions} onChangePage={onChangePage} activeScrollTop />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
