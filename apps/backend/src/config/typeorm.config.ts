import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { History } from '@/ history/history.entity';
import { Comment } from '@/comment/comment.entity';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'froxydb',
  entities: [User, Lotus, Comment, Tag, History],
  synchronize: true //todo: env로 release에서는 false가 되도록 해야함
};
