import { useMutation } from '@tanstack/react-query';
import { getLotusHistory, getLotusHistoryList, postCodeRun } from './api';
import { createQueryOptions } from '@/shared/createQueryOptions';

export const lotusHistoryQueryOptions = createQueryOptions('history', {
  list: getLotusHistoryList,
  detail: getLotusHistory
});

export const useCodeRunMutation = () => {
  const mutation = useMutation({
    mutationFn: postCodeRun
  });

  return mutation;
};
