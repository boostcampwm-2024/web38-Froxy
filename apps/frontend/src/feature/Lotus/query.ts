import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { deleteLotus, getLotusDetail, getLotusList, updateLotus } from './api';

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

export const useLotusDeleteMutation = () => {
  const mutation = useMutation({
    mutationFn: deleteLotus
  });

  return mutation;
};

export const useLotusUpdateMutation = () => {
  const mutation = useMutation({
    mutationFn: updateLotus
  });

  return mutation;
};
