import { Button, Heading } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from '@tanstack/react-router';

interface GlobalErrorProps {
  description?: string;
  handleRetry: () => void;
}

export function GlobalError({ description, handleRetry }: GlobalErrorProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">{description ?? '오류가 발생했습니다'}</Heading>
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
