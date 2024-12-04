import { Button, Heading } from '@froxy/design/components';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { CreateLotusButton, LogoutButton } from './navigation';
import { LoginButton } from './navigation/LoginButton';
import { userQueryOptions } from '@/feature/user/query';

export function Header() {
  const { data } = useQuery({
    ...userQueryOptions.info(),
    retry: 0
  });

  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/lotus' });
  };

  const image = data?.profile || '/image/exampleImage.jpeg';

  return (
    <header className="flex justify-center mb-7 w-full shadow-md bg-white">
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

              <Link to={'/user'} data-testid="header-profile">
                <img className="w-10 h-10 rounded-full" src={image} alt="프로필 사진" />
              </Link>
            </>
          ) : (
            <LoginButton variant={'default'}>Login</LoginButton>
          )}
        </div>
      </div>
    </header>
  );
}
