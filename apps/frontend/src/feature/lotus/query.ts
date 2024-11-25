import { useMutation } from '@tanstack/react-query';
import { createLotus, deleteLotus, getLotusDetail, getLotusList, updateLotus } from './api';
import { createQueryOptions } from '@/shared/createQueryOptions';

export const lotusQueryOptions = createQueryOptions('lotus', {
  list: getLotusList,
  detail: getLotusDetail
});

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

export const useLotusCreateMutation = () => {
  const mutation = useMutation({
    mutationFn: createLotus
  });

  return mutation;
};
