import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { LotusCreateRequestDto } from './lotus.createRequest.dto';
import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { LotusTag } from '@/relation/lotus.tag.entity';
import { User } from '@/user/user.entity';

export class LotusDto {
  @IsString()
  lotusId: string;

  @IsString()
  title: string;

  @IsBoolean()
  isPublic: boolean;

  @IsString()
  gistRepositoryId: string;

  @IsString()
  commitId: string;

  @IsString()
  language: string;

  @IsString()
  version: string;

  @IsString()
  createdAt: Date;

  @ValidateNested()
  @Type(() => User)
  user: User;

  @ValidateNested({ each: true })
  @Type(() => Comment)
  comments: Comment[];

  @ValidateNested({ each: true })
  @Type(() => History)
  historys: History[];

  @ValidateNested({ each: true })
  @Type(() => LotusTag)
  tags: LotusTag[];

  constructor(commitId: string, user: User, lotusInputData: LotusCreateRequestDto) {
    this.title = lotusInputData.title;
    this.isPublic = lotusInputData.isPublic;
    this.gistRepositoryId = lotusInputData.gistUuid;
    this.commitId = commitId;
    this.language = lotusInputData.language;
    this.version = lotusInputData.version;
    this.comments = [];
    this.historys = [];
    this.user = user;
  }
}
