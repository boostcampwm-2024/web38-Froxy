import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DockerModule } from './docker/docker.module';
import { GistModule } from './gist/gist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    DockerModule,
    GistModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
