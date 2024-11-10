import { Module } from '@nestjs/common';
import { GistService } from './gist.service';
import { GistController } from './gist.controller';

@Module({
  controllers: [GistController],
  providers: [GistService],
})
export class GistModule {}
