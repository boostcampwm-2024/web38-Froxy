import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getUserGistFile, getUserGistList, getUserInfo, getUserLotusList } from './api';

export const useUserInfoSuspenseQuery = () => {
  const query = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: async () => getUserInfo()
  });

  return query;
};

export const useUserLotusListSuspenseQuery = ({ page, size }: { page?: number; size?: number }) => {
  const query = useSuspenseQuery({
    queryKey: ['lotus', page],
    queryFn: async () => getUserLotusList({ page, size })
  });

  return query;
};

export const useUserGistListSuspenseInfinity = ({ page = 1, size }: { page?: number; size?: number } = {}) => {
  const { data: res, ...query } = useSuspenseInfiniteQuery({
    queryKey: ['gist', page],
    queryFn: async ({ pageParam }) => getUserGistList({ page: pageParam, size }),
    getNextPageParam: (prev) => prev.page + 1,
    initialPageParam: page
  });

  const data = res.pages.flatMap((res) => [...res.gists]);

  return { data, ...query };
};

export const useUserGistFileSuspenseQuery = ({ gistId }: { gistId: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['gist', gistId],
    queryFn: async () => getUserGistFile({ gistId })
  });

  return query;
};
