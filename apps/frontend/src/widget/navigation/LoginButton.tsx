import { ComponentProps } from 'react';
import { Button } from '@froxy/design/components';

type LoginButtonProps = ComponentProps<typeof Button>;

export function LoginButton(props: LoginButtonProps) {
  return (
    <>
      <Button {...props} asChild>
        <a href={`${import.meta.env.VITE_API_URL}/api/user/login`}>{props.children}</a>
      </Button>
    </>
  );
}
