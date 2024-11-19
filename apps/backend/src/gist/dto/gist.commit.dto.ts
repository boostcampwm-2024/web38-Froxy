import { IsDate, IsString, IsUrl } from 'class-validator';

export class CommitDto {
  @IsDate()
  committedAt: Date;

  @IsString()
  commitId: string;

  @IsUrl()
  url: string;

  static of(history: any): CommitDto {
    return {
      committedAt: history.committedAt,
      commitId: history.version,
      url: history.url
    };
  }
}
