import { ComponentProps } from 'react';
import { Button } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation } from '@/feature/User/query';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

type LoginButtonProps = ComponentProps<typeof Button> & {
  onLoginSuccess?: () => void;
};

export function LoginButton({ onLoginSuccess, ...props }: LoginButtonProps) {
  const [, set] = useLocalStorage({ key: 'token', initialValue: '' });

  const { mutate, isPending } = useLoginMutation();

  const queryClient = useQueryClient();

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: ({ token }) => {
        set(token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        onLoginSuccess?.();
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} {...props}>
      {props.children}
    </Button>
  );
}
