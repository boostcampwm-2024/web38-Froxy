import { Button, Heading, Text } from '@froxy/design/components';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LotusCardList } from '@/widget/LotusList/LotusCardList';
import { UserInfoBox } from '@/widget/User/UserInfoBox';

export const Route = createLazyFileRoute('/(main)/user/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-28">
      <UserInfoBox />
      <section>
        <div className="pb-12 flex justify-between items-center">
          <Heading size="lg">내가 작성한 Lotus</Heading>
          <Button variant={'ghost'}>
            <Text variant="muted">create Lotus</Text>
          </Button>
        </div>
        <LotusCardList />
      </section>
    </div>
  );
}
