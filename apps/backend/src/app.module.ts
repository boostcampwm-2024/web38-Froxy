import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { DockerModule } from './docker/docker.module';
import { GistModule } from './gist/gist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../.env')
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeORMConfig
    }),
    DockerModule,
    GistModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
