import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const lotusSearchValidation = z.object({
  page: z.number().default(1).optional()
});

export const Route = createFileRoute('/(main)/lotus/')({
  validateSearch: (search) => lotusSearchValidation.parse(search)
});
