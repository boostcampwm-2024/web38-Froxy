import { UserDto } from './user.dto';

export class CommentDto {
  id: string;
  created_at: string;
  body: string;
  owner: UserDto;
}
