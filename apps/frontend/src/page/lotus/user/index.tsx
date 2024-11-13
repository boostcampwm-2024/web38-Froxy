import { createFileRoute } from '@tanstack/react-router';
import { UserInfoBox } from '@/widget/User/UserInfoBox';

export const Route = createFileRoute('/lotus/user/')({
  component: RouteComponent
});

function RouteComponent() {
  return <UserInfoBox />;
}
