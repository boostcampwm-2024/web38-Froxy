import { userQueryOptions } from './query';
import { queryClient } from '@/app/query';
import { UserType } from '@/feature/user/type';

export const isAuthUser = async () => {
  try {
    const user = await queryClient.fetchQuery<UserType>(userQueryOptions.info());

    return !!user?.id && !!user?.nickname && !!user?.profile;
  } catch {
    return false;
  }
};
