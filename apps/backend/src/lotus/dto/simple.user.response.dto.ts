import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { User } from '@/user/user.entity';

export class SimpleUserResponseDto {
  @IsString()
  @ApiProperty({
    example: '121162781'
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: 'NickName7483'
  })
  nickname: string;

  @IsUrl()
  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/121162781?v=4'
  })
  profile: string;

  @IsUrl()
  @ApiProperty({
    example: 'https://gist.github.com/nickname'
  })
  gistUrl: string;

  static ofUserDto(userData: User) {
    return {
      id: userData.userId,
      nickname: userData.nickname,
      profile: userData.profilePath,
      gistUrl: userData.gistUrl
    };
  }
}
