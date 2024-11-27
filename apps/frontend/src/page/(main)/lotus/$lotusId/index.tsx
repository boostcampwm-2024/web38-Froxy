import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const historySearchPageValidate = z.object({
  page: z.number().default(1).optional()
});

export const Route = createFileRoute('/(main)/lotus/$lotusId/')({
  validateSearch: (search) => historySearchPageValidate.parse(search)
});
