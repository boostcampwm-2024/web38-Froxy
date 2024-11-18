import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserInfo, getUserLotusList } from './api';

export const useUserInfoSuspenseQuery = () => {
  const query = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: async () => getUserInfo()
  });

  return query;
};

export const useUserLotusListSuspenseQuery = ({ page = 1, size }: { page: number; size: number }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', page],
    queryFn: async () => getUserLotusList({ page, size })
  });

  return query;
};
