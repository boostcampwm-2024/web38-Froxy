import { IsString, IsUrl } from 'class-validator';
import { User } from '@/user/user.entity';

export class SimpleUserResponseDto {
  @IsString()
  id: string;

  @IsString()
  nickname: string;

  @IsUrl()
  profile: string;

  static ofUserDto(userData: User) {
    return {
      id: userData.userId,
      nickname: userData.nickname,
      profile: userData.profilePath
    };
  }
}
