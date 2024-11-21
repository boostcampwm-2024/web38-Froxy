import { Heading } from '@froxy/design/components';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/boundary';
import { SuspenseUserLotusPagination } from '@/widget/lotusList/SuspenseUserLotusPagination';
import { CreateLotusButton } from '@/widget/navigation';
import { SuspenseUserInfoBox } from '@/widget/user/SuspenseUserInfoBox';
import { SuspenseUserLotusList } from '@/widget/user/SuspenseUserLotusList';

const { useSearch } = getRouteApi('/(main)/user/');

export const Route = createLazyFileRoute('/(main)/user/')({
  component: RouteComponent
});

function RouteComponent() {
  const { page } = useSearch();

  return (
    <div className="flex flex-col gap-28">
      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
        <SuspenseUserInfoBox />
      </AsyncBoundary>
      <section>
        <div className="pb-12 flex justify-between items-center">
          <Heading size="lg">내가 작성한 Lotus</Heading>
          <CreateLotusButton />
        </div>
        <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
          <SuspenseUserLotusList page={page} />
        </AsyncBoundary>

        <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
          <SuspenseUserLotusPagination page={page} />
        </AsyncBoundary>
      </section>
    </div>
  );
}
