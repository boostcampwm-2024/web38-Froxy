import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

export class LotusDto {
  lotusId: string;
  title: string;
  isPublic: boolean;
  gistRepositoryId: string;
  commitId: string;
  language: string;
  version: string;
  createdAt: Date;
  user: User;
  comments: Comment[];
  historys: History[];
  category: Tag[];

  constructor(
    title: string,
    isPublic: boolean,
    gistRepositoryId: string,
    commitId: string,
    user: User,
    language: string,
    version: string
  ) {
    this.title = title;
    this.isPublic = isPublic;
    this.gistRepositoryId = gistRepositoryId;
    this.commitId = commitId;
    this.language = language;
    this.version = version;
    this.comments = [];
    this.historys = [];
    this.category = [];
    this.user = user;
  }
}
