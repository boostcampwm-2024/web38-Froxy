import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthUser } from '@/feature/user/util';

export const Route = createFileRoute('/(main)/lotus/create/')({
  beforeLoad: async () => {
    const isAuth = await isAuthUser();
    if (!isAuth) throw redirect({ to: '/' });
  }
});
