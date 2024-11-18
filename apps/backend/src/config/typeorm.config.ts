import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

export const typeORMConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_DATABASE'),
  entities: [User, Lotus, Comment, Tag, History],
  synchronize: true //todo: env로 release에서는 false가 되도록 해야함
});
