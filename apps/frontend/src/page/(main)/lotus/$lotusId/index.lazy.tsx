import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { AsyncBoundary } from '@/shared/boundary';
import { SuspenseLotusHistoryList } from '@/widget/history';
import { CodeRunButton } from '@/widget/lotusCodeRun';
import { SuspenseLotusDetail } from '@/widget/lotusDetail';
import { SuspenseLotusFiles } from '@/widget/lotusDetail/SuspenseLotusFiles';
import { SuspensePagination } from '@/widget/SuspensePagination';

import '@/app/style/github.css';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

const { useSearch, useNavigate, useParams } = getRouteApi('/(main)/lotus/$lotusId/');

function RouteComponent() {
  const { lotusId: id } = useParams();

  const { page = 1 } = useSearch();

  const navigate = useNavigate();

  const handleChangePage = (page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-16">
      <AsyncBoundary pending={<SuspenseLotusDetail.Skeleton />} rejected={() => <div>Error!</div>}>
        <SuspenseLotusDetail id={id} />
      </AsyncBoundary>

      <AsyncBoundary pending={<SuspenseLotusFiles.Skeleton />} rejected={() => <div>Error!</div>}>
        <SuspenseLotusFiles id={id} />
      </AsyncBoundary>

      <CodeRunButton lotusId={id} />

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusHistoryList id={id} page={page} />
      </AsyncBoundary>

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspensePagination
          queryOptions={lotusHistoryQueryOptions.list({ id, page })}
          onChangePage={handleChangePage}
        />
      </AsyncBoundary>
    </div>
  );
}
