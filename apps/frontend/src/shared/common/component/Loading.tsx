import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function Loading() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <DotLottieReact src="/json/frogAnimation.json" loop autoplay className="w-96" />
      <DotLottieReact src="/json/loadingAnimation.json" loop autoplay className="mt-[-7rem] w-96" />
    </div>
  );
}
