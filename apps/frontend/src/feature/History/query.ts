import { useSuspenseQuery } from '@tanstack/react-query';
import { getLotusHistoryList } from './api';

export const useLotusHistoryListSuspenseQuery = ({ id }: { id: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', 'detail', id, 'history'],
    queryFn: async () => getLotusHistoryList({ id })
  });

  return query;
};
