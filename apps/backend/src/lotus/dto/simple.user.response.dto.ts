import { GistApiFileListDto } from '@/gist/dto/gistApiFileList.dto';
import { User } from '@/user/user.entity';

export class SimpleUserResponseDto {
  id: string;
  nickname: string;
  profile: string;

  static ofUserDto(userData: User) {
    return {
      id: userData.userId,
      nickname: userData.nickname,
      profile: userData.profilePath
    };
  }
}
