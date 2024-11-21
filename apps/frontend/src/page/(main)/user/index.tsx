import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { isAuthUser } from '@/feature/user/util';

const userLotusSearchValidation = z.object({
  page: z.number().default(1).optional()
});

export const Route = createFileRoute('/(main)/user/')({
  beforeLoad: () => {
    if (!isAuthUser()) throw redirect({ to: '/' });
  },
  validateSearch: (search) => userLotusSearchValidation.parse(search)
});
