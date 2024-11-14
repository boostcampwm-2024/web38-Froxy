import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/(main)/lotus/create/')({
  component: RouteComponent
});

function RouteComponent() {
  return '여기가 Lotus 생성 페이지';
}
