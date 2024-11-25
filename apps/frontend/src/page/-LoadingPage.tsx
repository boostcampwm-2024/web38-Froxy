import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// NOTE: Loading 시 사용되는 로딩 페이지
export function LoadingPage() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <DotLottieReact src="/json/frogAnimation.json" loop autoplay className="w-96" />
      <DotLottieReact src="/json/loadingAnimation.json" loop autoplay className="mt-[-7rem] w-96" />
    </div>
  );
}
