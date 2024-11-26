import { Suspense } from 'react';
import { Button, Heading } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { createLazyFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { userQueryOptions } from '@/feature/user';
import { AsyncBoundary, ErrorBoundary } from '@/shared/boundary';
import { SuspenseLotusList } from '@/widget/lotusList';
import { SuspenseLotusPagination } from '@/widget/lotusList/SuspenseLotusPagination';
import { CreateLotusButton } from '@/widget/navigation';
import { SuspenseUserInfoBox } from '@/widget/user/SuspenseUserInfoBox';

const { useSearch } = getRouteApi('/(main)/user/');

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
        rejected={({ error, retry }) => <SuspenseUserInfoBox.ErrorFallback error={error} retry={retry} />}
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
            <SuspenseLotusList.ErrorFallback error={error} retry={reset} onChangePage={onChangePage} />
          )}
        >
          <Suspense fallback={<SuspenseLotusList.Skeleton />}>
            <SuspenseLotusList queryOptions={userLotusListQueryOptions} />
          </Suspense>

          <Suspense fallback={<SuspenseLotusPagination.Skeleton />}>
            <SuspenseLotusPagination queryOptions={userLotusListQueryOptions} onChangePage={onChangePage} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  const isLoginRequired = axios.isAxiosError(error) && error?.status === 401;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">{isLoginRequired ? '로그인이 필요합니다.' : '오류가 발생했습니다.'}</Heading>
      <Button asChild>
        <Link to={'/'}>시작 페이지로 이동하기</Link>
      </Button>
    </div>
  );
}
