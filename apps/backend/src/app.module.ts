import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './config/typeorm.config';
import { DockerModule } from './docker/docker.module';
import { GistModule } from './gist/gist.module';
<<<<<<< HEAD
import { HistoryModule } from './history/history.module';
=======
import { UserModule } from './user/user.module';
>>>>>>> bad42e0 (#53 oauth api (#60))

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
<<<<<<< HEAD
    HistoryModule
=======
    UserModule,
    AuthModule
>>>>>>> bad42e0 (#53 oauth api (#60))
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
