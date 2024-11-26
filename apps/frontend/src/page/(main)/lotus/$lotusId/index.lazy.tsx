import { Suspense } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { getLotusErrorData } from '@/feature/lotus';
import { GlobalError } from '@/shared';
import { ErrorBoundary } from '@/shared/boundary';
import { SuspenseLotusHistoryList } from '@/widget/history';
import { CodeRunButton } from '@/widget/lotusCodeRun';
import { SuspenseLotusDetail } from '@/widget/lotusDetail';
import { SuspenseLotusFiles } from '@/widget/lotusDetail/SuspenseLotusFiles';
import { SuspensePagination } from '@/widget/SuspensePagination';
import '@/app/style/github.css';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent,
  errorComponent: ErrorComponent
});

const { useSearch, useNavigate, useParams } = getRouteApi('/(main)/lotus/$lotusId/');

function RouteComponent() {
  const { lotusId: id } = useParams();

  const { page = 1 } = useSearch();

  const navigate = useNavigate();

  const handleChangePage = (page: number) => navigate({ search: { page } });

  return (
    <div className="flex flex-col gap-16">
      <Suspense fallback={<SuspenseLotusDetail.Skeleton />}>
        <SuspenseLotusDetail id={id} />
      </Suspense>

      <Suspense fallback={<SuspenseLotusFiles.Skeleton />}>
        <SuspenseLotusFiles id={id} />
      </Suspense>

      <CodeRunButton lotusId={id} />

      <ErrorBoundary
        fallback={({ error, reset }) => (
          <SuspenseLotusHistoryList.Error error={error} retry={reset} onChangePage={handleChangePage} />
        )}
      >
        <Suspense fallback={<SuspenseLotusHistoryList.Skeleton />}>
          <SuspenseLotusHistoryList id={id} page={page} />
        </Suspense>

        <Suspense fallback={<SuspensePagination.Skeleton />}>
          <SuspensePagination
            queryOptions={lotusHistoryQueryOptions.list({ id, page })}
            onChangePage={handleChangePage}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const { reset: retry } = useQueryErrorResetBoundary();

  const handleRetry = () => {
    retry();
    reset();
  };

  return <GlobalError description={getLotusErrorData(error)?.description} handleRetry={handleRetry} />;
}
