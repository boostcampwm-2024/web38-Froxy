import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>페이지 : 로그인 페이지</div>;
}
