import { UserDto } from './user.dto';

export class CommentDto {
  id: string;
  createdAt: string;
  content: string;
  owner: UserDto;
  static of(comment: any): CommentDto {
    return {
      id: comment.id,
      createdAt: comment.created_at,
      content: comment.body,
      owner: UserDto.of(comment.user)
    };
  }
}
