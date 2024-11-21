import { Button, Heading } from '@froxy/design/components';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { FaGithub } from 'react-icons/fa';
import { LoginButton } from '@/widget/navigation/LoginButton';

const { useNavigate } = getRouteApi('/');

export const Route = createLazyFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto px-12 w-full max-w-screen-xl h-screen flex justify-center items-center">
      <section className="flex-1 flex justify-center">
        <img className="max-w-lg" src="/image/onboardingImage.svg" alt="frog" />
      </section>
      <section className="flex-1 flex flex-col items-center gap-6 pl-12">
        <Heading size="sm" className="mb-4">
          Gist clone과정을 폴짝! 건너뛰고 테스트 ⭐️
        </Heading>
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
