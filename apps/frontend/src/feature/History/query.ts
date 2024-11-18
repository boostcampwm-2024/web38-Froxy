import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getLotusHistory, getLotusHistoryList, postCodeRun } from './api';

export const useLotusHistoryListSuspenseQuery = ({ id }: { id: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', 'detail', id, 'history'],
    queryFn: async () => getLotusHistoryList({ id })
  });

  return query;
};

interface HistoryDetailQueryProps {
  lotusId: string;
  historyId: string;
}

export const useLotusHistorySuspenseQuery = ({ lotusId, historyId }: HistoryDetailQueryProps) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', 'detail', lotusId, 'history', historyId],
    queryFn: async () => getLotusHistory({ id: lotusId, historyId })
  });

  return query;
};

export const useCodeRunMutation = () => {
  const mutation = useMutation({
    mutationFn: postCodeRun
  });

  return mutation;
};
