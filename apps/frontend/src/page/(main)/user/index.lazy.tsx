import { Suspense } from 'react';
import { Heading } from '@froxy/design/components';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import axios from 'axios';
import { userQueryOptions } from '@/feature/user';
import { GlobalError } from '@/shared';
import { AsyncBoundary, ErrorBoundary } from '@/shared/boundary';
import { SuspenseLotusList } from '@/widget/lotusList';
import { CreateLotusButton } from '@/widget/navigation';
import { SuspensePagination } from '@/widget/SuspensePagination';
import { SuspenseUserInfoBox } from '@/widget/user/SuspenseUserInfoBox';

const { useSearch, useNavigate } = getRouteApi('/(main)/user/');

export const Route = createLazyFileRoute('/(main)/user/')({
  component: RouteComponent,
  errorComponent: ErrorComponent
});

function RouteComponent() {
  const { page } = useSearch();
  const navigate = useNavigate();

  const userLotusListQueryOptions = userQueryOptions.lotusList({ page });

  const onChangePage = (page: number = 1) => navigate({ to: '/user', search: { page } });

  return (
    <div className="flex flex-col gap-28">
      <AsyncBoundary
        pending={<SuspenseUserInfoBox.Skeleton />}
        rejected={({ error, retry }) => <SuspenseUserInfoBox.Error error={error} retry={retry} />}
      >
        <SuspenseUserInfoBox />
      </AsyncBoundary>
      <section>
        <div className="pb-12 flex justify-between items-center">
          <Heading size="lg">내가 작성한 Lotus</Heading>
          <CreateLotusButton />
        </div>
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <SuspenseLotusList.Error error={error} retry={reset} onChangePage={onChangePage} />
          )}
        >
          <Suspense fallback={<SuspenseLotusList.Skeleton />}>
            <SuspenseLotusList queryOptions={userLotusListQueryOptions} />
          </Suspense>

          <Suspense fallback={<SuspensePagination.Skeleton />}>
            <SuspensePagination queryOptions={userLotusListQueryOptions} onChangePage={onChangePage} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const { reset: retry } = useQueryErrorResetBoundary();

  const isLoginRequired = axios.isAxiosError(error) && error?.status === 401;

  const handleRetry = () => {
    retry();
    reset();
  };

  return (
    <GlobalError
      description={isLoginRequired ? '로그인이 필요합니다.' : '오류가 발생했습니다.'}
      handleRetry={handleRetry}
    />
  );
}
