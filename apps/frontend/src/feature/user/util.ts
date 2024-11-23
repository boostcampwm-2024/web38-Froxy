import { getUserInfo } from './api';
import { queryClient } from '@/app/query';
import { UserType } from '@/feature/user/type';

export const isAuthUser = async () => {
  try {
    const user = await queryClient.fetchQuery<UserType>({
      queryKey: ['user'],
      queryFn: getUserInfo
    });

    return !!user?.id && !!user?.nickname && !!user?.profile;
  } catch {
    return false;
  }
};
