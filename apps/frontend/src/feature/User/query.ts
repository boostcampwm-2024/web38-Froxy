import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserInfo, getUserLotusList } from './api';

export const useUserInfoSuspenseQuery = () => {
  const query = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: async () => getUserInfo()
  });

  return query;
};

export const useUserLotusListSuspenseQuery = ({
  page = 1,
  size,
  userId
}: {
  page: number;
  size: number;
  userId: string;
}) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', page, userId],
    queryFn: async () => getUserLotusList({ page, size, userId })
  });

  return query;
};
