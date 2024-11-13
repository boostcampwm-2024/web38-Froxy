import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/lotus/detail/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Lotus 디테일 페이지</div>;
}
