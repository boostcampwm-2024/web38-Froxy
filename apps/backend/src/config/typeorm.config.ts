import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

export const typeORMConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('MYSQL_HOST'),
  port: configService.get<number>('MYSQL_PORT'),
  username: configService.get<string>('MYSQL_USER'),
  password: configService.get<string>('MYSQL_PASSWORD'),
  database: configService.get<string>('MYSQL_DATABASE'),
  entities: [User, Lotus, Comment, Tag, History],
  synchronize: true //todo: env로 release에서는 false가 되도록 해야함
});
