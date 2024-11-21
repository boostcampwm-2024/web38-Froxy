import { User } from '@/user/user.entity';

export class UserPatchDTO {
  nickname: string;

  profile: string;

  static ofUser(userData: User): UserPatchDTO {
    return {
      nickname: userData.nickname,
      profile: userData.profilePath
    };
  }
}
