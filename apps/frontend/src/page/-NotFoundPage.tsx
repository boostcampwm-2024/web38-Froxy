import { Button } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from '@tanstack/react-router';

// NOTE: createRouter에서 defaultNotFoundComponent 호출 시 사용됨
export function NotFoundPage() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <DotLottieReact src="/json/frogAnimation.json" loop autoplay className="w-96" />
      <DotLottieReact src="/json/404Animation.json" loop autoplay className="mt-[-7rem] w-96" />
      <Button variant={'outline'} asChild>
        <Link to={'/'}>Go to Froxy site</Link>
      </Button>
    </div>
  );
}
