import { Button } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { useLoginMutation } from '@/feature/User/query';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function LoginButton() {
  const [, set] = useLocalStorage({ key: 'token', initialValue: '' });

  const { mutate, isPending } = useLoginMutation();

  const queryClient = useQueryClient();

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: ({ token }) => {
        set(token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    });
  };

  return (
    <Button variant={'default'} onClick={handleClick} disabled={isPending}>
      Login
    </Button>
  );
}
