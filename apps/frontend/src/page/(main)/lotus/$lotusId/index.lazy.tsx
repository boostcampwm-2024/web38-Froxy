import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

function RouteComponent() {
  return '여기가 상세 페이지!';
}
