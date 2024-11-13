import { GistApiFileDto } from './gistApiFile.dto';
import { UserDto } from './user.dto';

export class GistApiFileListDto {
  id: string;
  description: string;
  files: GistApiFileDto[];
  owner: UserDto;
  public: boolean;

  constructor(id: string, description: string, files: GistApiFileDto[], owner: UserDto, isPublic: boolean) {
    this.id = id;
    this.description = description;
    this.files = files;
    this.owner = owner;
    this.public = isPublic;
  }
}
