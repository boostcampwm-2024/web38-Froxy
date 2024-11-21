import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/boundary';
import { Pagination } from '@/shared/pagination/Pagination';
import { LotusSearchBar, SuspenseLotusList } from '@/widget/lotusList';

const { useSearch, useNavigate } = getRouteApi('/(main)/lotus/');

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  const search = useSearch();
  const navigate = useNavigate();

  const page = search.page;

  return (
    <div>
      <LotusSearchBar />

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
        <SuspenseLotusList page={page} />
      </AsyncBoundary>

      <Pagination
        totalPages={5}
        initialPage={page}
        onChangePage={(page) => navigate({ to: '/lotus', search: { page } })}
      />
    </div>
  );
}
