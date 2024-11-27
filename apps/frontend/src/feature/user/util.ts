import { userQueryOptions } from './query';
import { queryClient } from '@/app/query';

export const isAuthUser = async () => {
  try {
    const user = await queryClient.fetchQuery(userQueryOptions.info());

    return !!user?.id && !!user?.nickname && !!user?.profile;
  } catch {
    return false;
  }
};
