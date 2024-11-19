import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Comment } from '@/comment/comment.entity';
import { Lotus } from '@/lotus/lotus.entity';

export class UserCreateDto {
  @IsString()
  userId: string;

  @IsString()
  nickname: string;

  @IsUrl()
  profilePath: string;

  @IsString()
  gitToken: string;

  @IsNumber()
  gitId: number;

  @ValidateNested({ each: true })
  @Type(() => Lotus)
  lotuses: Lotus[];

  @ValidateNested({ each: true })
  @Type(() => Comment)
  comments: Comment[];

  constructor(response, accessToken) {
    this.nickname = response.login;
    this.profilePath = response.avatar_url;
    this.gitToken = accessToken;
    this.gitId = response.id;
    this.lotuses = [];
    this.comments = [];
  }
}
