import { ComponentProps } from 'react';
import { Button } from '@froxy/design/components';

type LoginButtonProps = ComponentProps<typeof Button>;

export function LoginButton(props: LoginButtonProps) {
  const githubURL = `https://github.com/login/oauth/authorize?client_id=${
    import.meta.env.VITE_OAUTH_CLIENT_ID
  }&redirect_uri=${import.meta.env.VITE_OAUTH_LOGIN_CALLBACK_URL}`;

  const handleLogin = async () => {
    window.location.href = githubURL;
  };

  return (
    <>
      <Button {...props} onClick={handleLogin}>
        {props.children}
      </Button>
    </>
  );
}
