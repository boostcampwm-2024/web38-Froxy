import { IsDate, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CommentDto {
  @IsString()
  id: string;

  @IsDate()
  createdAt: string;

  @IsString()
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
