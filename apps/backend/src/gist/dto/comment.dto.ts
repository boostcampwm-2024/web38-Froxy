import { UserDto } from './user.dto';

export class CommentDto {
  id: string;
  updated_at: string;
  body: string;
  owner: UserDto;
}
