import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useLoginQuery, userQueryOptions } from '@/feature/user/query';
import { LoadingPage } from '@/page/-LoadingPage';
import { useLocalStorage } from '@/shared';
import { useToast } from '@/shared/toast';

const loginTokenValidation = z.object({
  code: z.string().min(1, '깃허브 인증에 실패했습니다.')
});

export const Route = createFileRoute('/login/')({
  validateSearch: (search) => loginTokenValidation.parse(search),
  component: RouteComponent,
  errorComponent: ErrorComponent
});

function RouteComponent() {
  const { code } = Route.useSearch();

  const [, set] = useLocalStorage({ key: 'token', initialValue: '' });

  const { data: token, error: loginError } = useLoginQuery({ code });

  const { data: user, error: userInfoError, refetch } = useQuery(userQueryOptions.info());

  useEffect(() => {
    if (token?.token) {
      set(token.token);
      refetch();
    }
  }, [token, set, refetch]);

  if (loginError || userInfoError) throw new Error('유저 정보 조회에 실패했습니다.');

  if (!user) return <LoadingPage />;

  return <SuccessComponent nickname={user.nickname} />;
}

function SuccessComponent({ nickname }: { nickname: string }) {
  const { toast } = useToast({ isCloseOnUnmount: false });

  useEffect(() => {
    toast({ description: `${nickname}님 환영합니다!`, duration: 2000 });
  }, [toast, nickname]);

  return <Navigate to="/lotus" />;
}

function ErrorComponent() {
  const { toast } = useToast({ isCloseOnUnmount: false });

  useEffect(() => {
    toast({
      variant: 'error',
      description: '로그인에 실패했습니다.',
      duration: 2000
    });
  }, [toast]);

  return <Navigate to="/" />;
}
