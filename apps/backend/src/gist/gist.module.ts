import { Module } from '@nestjs/common';
//import { GistController } from './gist.controller';
import { GistService } from './gist.service';

@Module({
  //controllers: [GistController],
  providers: [GistService],
  exports: [GistService]
})
export class GistModule {}
