import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthUser } from '@/feature/user/util';

export const Route = createFileRoute('/(main)/lotus/create/')({
  beforeLoad: async () => {
    if (!(await isAuthUser())) throw redirect({ to: '/' });
  }
});
