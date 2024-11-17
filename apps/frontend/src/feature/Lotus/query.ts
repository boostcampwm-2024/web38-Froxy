import { useSuspenseQuery } from '@tanstack/react-query';
import { getLotusList } from './api';

export const useLotusListSuspenseQuery = ({ page = 1 }: { page?: number } = {}) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', page],
    queryFn: async () => getLotusList({ page })
  });

  return query;
};
