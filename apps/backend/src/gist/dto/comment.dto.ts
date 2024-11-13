import { UserDto } from './user.dto';

export class CommentDto {
  id: string;
  created_at: string;
  body: string;
  owner: UserDto;

  constructor(id: string, created_at: string, body: string, owner: UserDto) {
    this.id = id;
    this.created_at = created_at;
    this.body = body;
    this.owner = owner;
  }
}
