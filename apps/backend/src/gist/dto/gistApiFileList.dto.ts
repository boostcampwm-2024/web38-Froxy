import { GistApiFileDto } from './gistApiFile.dto';
import { UserDto } from './user.dto';

export class GistApiFileListDto {
  id: string;
  description: string;
  files: GistApiFileDto[];
  owner: UserDto;
  public: boolean;
}
