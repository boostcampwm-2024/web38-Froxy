import { Navigate, createFileRoute } from '@tanstack/react-router';
import { useToast } from '@/shared/hooks/useToast';

export const Route = createFileRoute('/login/fail/')({
  component: RouteComponent
});

function RouteComponent() {
  const { toast } = useToast();

  toast({ variant: 'error', description: '로그인에 실패했습니다.', duration: 2000 });

  return <Navigate to="/" />;
}
