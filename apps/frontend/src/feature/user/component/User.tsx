import { ComponentProps, HTMLProps, createContext, useContext } from 'react';
import { Link } from '@tanstack/react-router';
import { Text } from '@/components';
import { UserModel } from '@/feature/user/model';
import { cn } from '@/index';

const UserContext = createContext<UserModel | null>(null);

const useUserContext = () => {
  const user = useContext(UserContext);

  if (!user) throw new Error('User context is not provided');

  return user;
};

type UserNameProps = ComponentProps<typeof Text>;

export function UserName(props: UserNameProps) {
  const { nickname } = useUserContext();

  // TODO: 해당 사용자의 마이페이지로 이동하기
  return (
    <Text size="md" {...props}>
      {nickname}
    </Text>
  );
}

type UserAvatarProps = HTMLProps<HTMLImageElement>;

export function UserAvatar({ className, ...props }: UserAvatarProps) {
  const { profile, nickname } = useUserContext();

  const image = profile;

  return <img src={image} alt={nickname} className={cn('w-16 h-16 rounded-full', className)} {...props} />;
}

type UserLinkProps = {
  children: React.ReactNode;
  className?: string;
};

// TODO: 해당 사용자의 마이페이지로 이동하기
export function UserLink(props: UserLinkProps) {
  // const { id } = useUserContext();

  return <Link to="/user" {...props} />;
}

export function UserProvider({ user, children }: { user: UserModel; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const User = Object.assign(UserProvider, {
  Avatar: UserAvatar, //
  Link: UserLink,
  Name: UserName
});
