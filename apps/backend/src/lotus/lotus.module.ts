import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotusController } from './lotus.controller';
import { Lotus } from './lotus.entity';
import { LotusRepository } from './lotus.repository';
import { LotusService } from './lotus.service';
import { AuthModule } from '@/auth/auth.module';
import { GistModule } from '@/gist/gist.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lotus]), GistModule, forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  controllers: [LotusController],
  providers: [LotusService, LotusRepository],
  exports: [LotusService, LotusRepository]
})
export class LotusModule {}
