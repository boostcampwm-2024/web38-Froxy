import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const userLotusSearchValidation = z.object({
  page: z.number().default(1)
});

export const Route = createFileRoute('/(main)/user/')({
  validateSearch: (search) => userLotusSearchValidation.parse(search)
});
