import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getLotusHistoryList, postCodeRun } from './api';

export const useLotusHistoryListSuspenseQuery = ({ id }: { id: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', 'detail', id, 'history'],
    queryFn: async () => getLotusHistoryList({ id })
  });

  return query;
};

export const useCodeRunMutation = () => {
  const mutation = useMutation({
    mutationFn: postCodeRun
  });

  return mutation;
};
