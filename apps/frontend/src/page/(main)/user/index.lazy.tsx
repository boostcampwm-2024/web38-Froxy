import { Button, Heading, Text } from '@froxy/design/components';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/components/AsyncBoundary';
import { Pagination } from '@/widget/Pagination';
import { SuspenseUserInfoBox } from '@/widget/User/SuspenseUserInfoBox';
import { SuspenseUserLotusList } from '@/widget/User/SuspenseUserLotusList';

const { useSearch, useNavigate } = getRouteApi('/(main)/user/');

export const Route = createLazyFileRoute('/(main)/user/')({
  component: RouteComponent
});

function RouteComponent() {
  const search = useSearch();
  const navigate = useNavigate();

  const page = search.page;

  return (
    <div className="flex flex-col gap-28">
      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
        <SuspenseUserInfoBox />
      </AsyncBoundary>
      <section>
        <div className="pb-12 flex justify-between items-center">
          <Heading size="lg">내가 작성한 Lotus</Heading>
          <Button variant={'ghost'}>
            <Text variant="muted">create Lotus</Text>
          </Button>
        </div>
        <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error</div>}>
          <SuspenseUserLotusList page={page} />
        </AsyncBoundary>

        <Pagination
          totalPages={5}
          initialPage={page}
          onChangePage={(page) => navigate({ to: '/user', search: { page } })}
        />
      </section>
    </div>
  );
}
