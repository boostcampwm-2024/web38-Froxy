import { Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { Header } from '@/widget/Header';

export const Route = createLazyFileRoute('/(main)')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <Header />
      <div className="w-full max-w-screen-xl pb-20 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
