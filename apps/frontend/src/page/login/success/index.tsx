import { useEffect } from 'react';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useUserQuery } from '@/feature/User/query';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useToast } from '@/shared/hooks/useToast';

const loginTokenValidation = z.object({
  token: z.string().min(1, '토큰이 없습니다.')
});

export const Route = createFileRoute('/login/success/')({
  validateSearch: (search) => loginTokenValidation.parse(search),
  component: RouteComponent,
  errorComponent: ErrorComponent
});

function RouteComponent() {
  const [, set] = useLocalStorage({ key: 'token', initialValue: '' });

  const { token } = Route.useSearch();

  const { data, error, isLoading } = useUserQuery();

  useEffect(() => {
    set(token);
  }, [token, set, data]);

  if (error) throw new Error('??');

  if (isLoading) return <div>...Loading</div>;

  return <SuccessComponent />;
}

function SuccessComponent() {
  const { toast } = useToast();

  toast({ description: `님 환영합니다!`, duration: 2000 });

  return <Navigate to="/lotus" />;
}

function ErrorComponent() {
  const { toast } = useToast();

  toast({ variant: 'error', description: '로그인에 실패했습니다.', duration: 2000 });

  return <Navigate to="/" />;
}
