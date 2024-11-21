import { IsString, IsUrl } from 'class-validator';
import { User } from '@/user/user.entity';

export class UserPatchDTO {
  @IsString()
  nickname: string;

  @IsUrl()
  profile: string;

  static ofUser(userData: User): UserPatchDTO {
    return {
      nickname: userData.nickname,
      profile: userData.profilePath
    };
  }
}
