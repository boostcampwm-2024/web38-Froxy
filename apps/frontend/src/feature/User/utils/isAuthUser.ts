import { queryClient } from '@/app/query';
import { UserType } from '@/feature/User/type';

export const isAuthUser = () => {
  const user = queryClient.getQueryData<UserType>(['user']);

  return !!user?.id && !!user?.nickname && !!user?.profile;
};
