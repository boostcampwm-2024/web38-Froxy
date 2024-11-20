import { Button, Text } from '@froxy/design/components';
import { Link } from '@tanstack/react-router';

export function CreateLotusButton() {
  return (
    <Button variant={'ghost'} asChild>
      <Text size="sm" variant="muted" asChild>
        <Link to="/lotus/create">Create Lotus</Link>
      </Text>
    </Button>
  );
}
