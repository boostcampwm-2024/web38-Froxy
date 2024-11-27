import { useMutation, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getLogin, getUserGistFile, getUserGistList, getUserInfo, getUserLotusList, patchUserInfo } from './api';
import { createQueryOptions } from '@/shared/createQueryOptions';

export const userQueryOptions = createQueryOptions('user', {
  info: getUserInfo,
  lotusList: getUserLotusList,
  gistList: getUserGistList,
  gistFile: getUserGistFile
});

export const useUserGistListSuspenseInfinity = ({ page = 1, size }: { page?: number; size?: number } = {}) => {
  const { queryKey } = userQueryOptions.gistList({ page, size });

  const { data: res, ...query } = useSuspenseInfiniteQuery({
    queryKey: [...queryKey, 'infinity'],
    queryFn: async ({ pageParam }) => userQueryOptions.gistList({ page: pageParam, size }).queryFn(),
    getNextPageParam: (prev) => prev.page + 1,
    initialPageParam: page
  });

  const data = res.pages.flatMap((res) => [...res.gists]);

  return { data, ...query };
};

export const useUserMutation = () => {
  const mutation = useMutation({
    mutationFn: patchUserInfo
  });

  return mutation;
};

export const useLoginQuery = ({ code }: { code: string }) => {
  const query = useQuery({
    queryKey: ['token'],
    queryFn: () => getLogin({ code })
  });

  return query;
};
