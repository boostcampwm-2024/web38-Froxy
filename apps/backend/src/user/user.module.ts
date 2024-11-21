import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { GistModule } from '@/gist/gist.module';
import { LotusModule } from '@/lotus/lotus.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LotusModule), GistModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule {}
