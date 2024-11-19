import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './config/typeorm.config';
import { DockerModule } from './docker/docker.module';
import { GistModule } from './gist/gist.module';
import { HistoryModule } from './history/history.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeORMConfig
    }),
    DockerModule,
    GistModule,
    HistoryModule,
    UserModule,
    AuthModule,
    TagModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
