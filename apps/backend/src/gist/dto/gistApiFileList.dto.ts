import { CommitDto } from './gist.commit.dto';
import { GistApiFileDto } from './gistApiFile.dto';
import { UserDto } from './user.dto';

export class GistApiFileListDto {
  id: string;
  description: string;
  files: GistApiFileDto[];
  history: CommitDto[];
  owner: UserDto;
  public: boolean;

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
