import { Button, Heading } from '@froxy/design/components';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { FaGithub } from 'react-icons/fa';
import { LoginButton } from '@/widget/navigation/LoginButton';
import { OnBoardingCarousel } from '@/widget/onboarding/OnboardingCarousel';

const { useNavigate } = getRouteApi('/');

export const Route = createLazyFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <main className="w-screen h-screen">
      <OnBoardingCarousel />
      <section className="bg-white w-full h-1/2 lg:h-1/3 lg:w-1/3 flex flex-col gap-5 justify-center items-center lg:items-start fixed top-1/2 lg:right-0 lg:m-10 transform -translate-y-1/2 p-10 rounded-lg shadow-lg">
        <div className="flex gap-2">
          <img src="/image/logoIcon.svg" className="rounded-lg w-6 h-6" />
          <Heading size="sm" className="mb-4">
            FROXY
          </Heading>
        </div>

        <Button className="w-full max-w-lg" variant={'default'} onClick={() => navigate({ to: '/lotus' })}>
          공개 프로젝트 보러가기
        </Button>
        <LoginButton className="w-full max-w-lg" variant={'outline'}>
          <FaGithub />
          GitHub로 로그인하기
        </LoginButton>
      </section>
    </main>
  );
}
