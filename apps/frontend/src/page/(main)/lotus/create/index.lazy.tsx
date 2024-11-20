import { createLazyFileRoute } from '@tanstack/react-router';
import { LotusCreateForm } from '@/widget/LotusCreate/LotusCreateForm';

export const Route = createLazyFileRoute('/(main)/lotus/create/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <LotusCreateForm />
    </div>
  );
}
