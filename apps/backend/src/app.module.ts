import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GistModule } from './gist/gist.module';

@Module({
  imports: [GistModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
