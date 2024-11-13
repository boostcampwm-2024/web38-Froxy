import { Button, Heading } from '@froxy/design/components';

export function Header() {
  // TODO: 로그인 여부 확인하는 로직 추가 필요
  const isLogin = false;

  return (
    <div className="w-full py-7 px-2 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img className="w-14 h-14" src="/image/logoIcon.svg" alt="로고" />
        <Heading size="lg">Froxy</Heading>
      </div>
      <div className="flex items-center gap-4">
        {isLogin ? (
          <>
            <Button variant={'outline'}>create Lotus</Button>
            <img className="w-10 h-10 rounded-full" src="/image/exampleImage.jpeg" alt="프로필 사진" />
          </>
        ) : (
          <Button variant={'default'}>Login</Button>
        )}
      </div>
    </div>
  );
}
