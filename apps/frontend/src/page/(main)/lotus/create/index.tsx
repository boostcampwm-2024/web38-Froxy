import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthUser } from '@/feature/User/utils/isAuthUser';

export const Route = createFileRoute('/(main)/lotus/create/')({
  beforeLoad: () => {
    if (!isAuthUser()) throw redirect({ to: '/' });
  }
});
