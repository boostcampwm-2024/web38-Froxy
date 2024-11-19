import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { CommitDto } from './gist.commit.dto';
import { GistApiFileDto } from './gistApiFile.dto';
import { UserDto } from './user.dto';

export class GistApiFileListDto {
  @IsString()
  id: string;

  @IsString()
  description: string;

  @IsString()
  files: GistApiFileDto[];

  @IsBoolean()
  public: boolean;

  @ValidateNested({ each: true })
  @Type(() => CommitDto)
  history: CommitDto[];

  @ValidateNested()
  @Type(() => UserDto)
  owner: UserDto;

  static of(gistData: any, files: GistApiFileDto[]): GistApiFileListDto {
    return {
      id: gistData.id,
      description: gistData.description,
      files: files,
      owner: UserDto.of(gistData.owner),
      public: gistData.public,
      history: gistData.history
        ? gistData.history.map((commit) => {
            return CommitDto.of(commit);
          })
        : null
    };
  }
}
