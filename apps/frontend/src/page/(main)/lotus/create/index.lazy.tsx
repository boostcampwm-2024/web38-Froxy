import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { GlobalError } from '@/shared';
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
    <GlobalError
      description={isLoginRequired ? '로그인이 필요합니다.' : '오류가 발생했습니다.'}
      handleRetry={handleRetry}
    />
  );
}
