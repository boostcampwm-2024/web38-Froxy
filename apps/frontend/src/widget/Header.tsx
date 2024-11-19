import { Button, Heading } from '@froxy/design/components';
import { useNavigate } from '@tanstack/react-router';
import { CreateLotusButton, LoginButton, LogoutButton } from './Navigation';
import { useUserQuery } from '@/feature/User/query';

export function Header() {
  const { data } = useUserQuery();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/lotus' });
  };

  return (
    <header className="flex justify-center mb-7 w-full shadow-md">
      <div className="w-full max-w-screen-xl py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Button className="flex items-center gap-4" variant={null} onClick={() => handleClick()}>
          <img className="w-14 h-14" src="/image/logoIcon.svg" alt="로고" />
          <Heading size="lg">Froxy</Heading>
        </Button>
        <div className="flex items-center gap-8">
          {data ? (
            <>
              <div className="flex items-center">
                <CreateLotusButton />
                <LogoutButton />
              </div>

              <img className="w-10 h-10 rounded-full" src="/image/exampleImage.jpeg" alt="프로필 사진" />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
