import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusQueryOptions } from '@/feature/lotus';
import { AsyncBoundary } from '@/shared/boundary';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';
import { SuspensePagination } from '@/widget/SuspensePagination';

const { useSearch, useNavigate } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page, keyword } = useSearch();

  const lotusListQueryOptions = lotusQueryOptions.list({ page, keyword });

  const navigate = useNavigate();

  const changePage = (page: number) => navigate({ to: '/lotus', search: { page } });

  return (
    <div>
      <LotusSearchBar current={keyword} />

      <AsyncBoundary pending={<SuspenseLotusList.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseLotusList queryOptions={lotusListQueryOptions} />
      </AsyncBoundary>

      <AsyncBoundary pending={<SuspensePagination.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspensePagination queryOptions={lotusListQueryOptions} onChangePage={changePage} activeScrollTop />
      </AsyncBoundary>
    </div>
  );
}
