import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>페이지 : 시작 페이지임!! - 아마 여기가 온보딩 페이지?</div>;
}
