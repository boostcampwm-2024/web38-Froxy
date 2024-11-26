import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { Button, Heading } from '@/components';
import { LotusCreateForm } from '@/widget/lotusCreate/LotusCreateForm';

export const Route = createLazyFileRoute('/(main)/lotus/create/')({
  component: RouteComponent,
  errorComponent: ErrorComponent
});

function RouteComponent() {
  return (
    <div>
      <LotusCreateForm />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const { reset: retry } = useQueryErrorResetBoundary();

  const isLoginRequired = axios.isAxiosError(error) && error?.status === 401;

  const handleRetry = () => {
    retry();
    reset();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">{isLoginRequired ? '로그인이 필요합니다.' : '오류가 발생했습니다.'}</Heading>
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link to={'/lotus'}>메인 페이지로 이동하기</Link>
        </Button>
        <Button variant={'secondary'} onClick={handleRetry}>
          다시 시도하기
        </Button>
      </div>
    </div>
  );
}
