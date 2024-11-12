import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Header } from '@/widget/Header';

export const Route = createFileRoute('/lotus')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-screen-xl pb-20 px-4 sm:px-6 lg:px-8">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
