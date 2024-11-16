import { Comment } from '@/comment/comment.entity';
import { Lotus } from '@/lotus/lotus.entity';

export class UserCreateDto {
  userId: string;
  nickname: string;
  profilePath: string;
  gitToken: string;
  gitId: number;
  lotuses: Lotus[];
  comments: Comment[];

  constructor(response, accessToken) {
    this.nickname = response.login;
    this.profilePath = response.avatar_url;
    this.gitToken = accessToken;
    this.gitId = response.id;
    this.lotuses = [];
    this.comments = [];
  }
}
