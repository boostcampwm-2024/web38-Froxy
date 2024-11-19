import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { Tag } from '@/tag/tag.entity';
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
  @Type(() => Tag)
  category: Tag[];

  constructor(
    title: string,
    isPublic: boolean,
    gistRepositoryId: string,
    commitId: string,
    user: User,
    language: string,
    version: string
  ) {
    this.title = title;
    this.isPublic = isPublic;
    this.gistRepositoryId = gistRepositoryId;
    this.commitId = commitId;
    this.language = language;
    this.version = version;
    this.comments = [];
    this.historys = [];
    this.category = [];
    this.user = user;
  }
}
