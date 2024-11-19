import { IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  login: string;

  @IsNumber()
  id: number;

  @IsString()
  avatarUrl: string;

  static of(gistOwner: any): UserDto {
    return {
      login: gistOwner.login,
      id: gistOwner.id,
      avatarUrl: gistOwner.avatar_url
    };
  }
}
