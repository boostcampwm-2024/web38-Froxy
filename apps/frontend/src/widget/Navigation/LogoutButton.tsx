import { Button, Text } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function LogoutButton() {
  const [, set] = useLocalStorage({ key: 'token', initialValue: '' });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleClick = () => {
    set('');
    queryClient.invalidateQueries({ queryKey: ['user'] });

    navigate({ to: '/' });
  };

  return (
    <Button variant={'ghost'} onClick={handleClick}>
      <Text size="sm" variant="muted">
        Logout
      </Text>
    </Button>
  );
}
