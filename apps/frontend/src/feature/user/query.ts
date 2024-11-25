import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getUserGistFile, getUserGistList, getUserInfo, getUserLotusList, patchUserInfo, postLogin } from './api';
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

export const useLoginMutation = () => {
  const mutation = useMutation({
    mutationFn: postLogin
  });

  return mutation;
};
