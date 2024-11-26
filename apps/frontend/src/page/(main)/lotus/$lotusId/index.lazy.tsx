import { Suspense } from 'react';
import { Button, Heading } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { getLotusErrorData } from '@/feature/lotus';
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
          <SuspenseLotusHistoryList.ErrorFallback error={error} retry={reset} onChangePage={handleChangePage} />
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

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">{getLotusErrorData(error)?.description}</Heading>
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link to={'/lotus'}>메인 페이지로 이동하기</Link>
        </Button>
        <Button variant={'secondary'} onClick={handleRetry}>
          다시 시도하기
        </Button>
      </div>
    </div>
  );
}
