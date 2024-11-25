import { Heading } from '@froxy/design/components';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { userQueryOptions } from '@/feature/user';
import { AsyncBoundary } from '@/shared/boundary';
import { SuspenseLotusList } from '@/widget/lotusList';
import { SuspenseLotusPagination } from '@/widget/lotusList/SuspenseLotusPagination';
import { CreateLotusButton } from '@/widget/navigation';
import { SuspenseUserInfoBox } from '@/widget/user/SuspenseUserInfoBox';

const { useSearch } = getRouteApi('/(main)/user/');

export const Route = createLazyFileRoute('/(main)/user/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page } = useSearch();

  const userLotusListQueryOptions = userQueryOptions.lotusList({ page });

  return (
    <div className="flex flex-col gap-28">
      <AsyncBoundary pending={<SuspenseUserInfoBox.Skeleton />} rejected={() => <div>Error</div>}>
        <SuspenseUserInfoBox />
      </AsyncBoundary>
      <section>
        <div className="pb-12 flex justify-between items-center">
          <Heading size="lg">내가 작성한 Lotus</Heading>
          <CreateLotusButton />
        </div>
        <AsyncBoundary pending={<SuspenseLotusList.Skeleton />} rejected={() => <div>Error</div>}>
          <SuspenseLotusList queryOptions={userLotusListQueryOptions} />
        </AsyncBoundary>

        <AsyncBoundary pending={<SuspenseLotusPagination.Skeleton />} rejected={() => <div>Error</div>}>
          <SuspenseLotusPagination queryOptions={userLotusListQueryOptions} />
        </AsyncBoundary>
      </section>
    </div>
  );
}
