import { History } from '@/ history/history.entity';
import { Comment } from '@/comment/comment.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

export class LotusDto {
  lotusId: string;
  title: string;
  isPublic: boolean;
  gistRepositoryId: string;
  commitId: string;
  createdAt: Date;
  user: User;
  comments: Comment[];
  historys: History[];
  category: Tag[];

  constructor(title: string, isPublic: boolean, gistRepositoryId: string, commitId: string, user: User) {
    const createdAt = new Date();

    this.title = title;
    this.isPublic = isPublic;
    this.gistRepositoryId = gistRepositoryId;
    this.commitId = commitId;
    this.createdAt = createdAt;
    this.comments = [];
    this.historys = [];
    this.category = [];
    this.user = user;
  }
}
