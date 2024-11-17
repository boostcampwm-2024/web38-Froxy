import { useSuspenseQuery } from '@tanstack/react-query';
import { getLotusDetail, getLotusList } from './api';

export const useLotusListSuspenseQuery = ({ page = 1 }: { page?: number } = {}) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', page],
    queryFn: async () => getLotusList({ page })
  });

  return query;
};

export const useLotusSuspenseQuery = ({ id }: { id: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', 'detail', id],
    queryFn: async () => getLotusDetail({ id })
  });

  return query;
};
