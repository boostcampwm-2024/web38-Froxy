import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DockerConsumer } from './docker.consumer.js';
import { DockerController } from './docker.controller.js';
import { DockerContainerPool } from './docker.pool.js';
import { DockerProducer } from './docker.producer.js';
import { GistModule } from '@/gist/gist.module';

@Module({
  imports: [
    GistModule,
    BullModule.forRoot({
      redis: {
        host: '211.188.48.24', // Redis 호스트 주소
        port: 6379 // Redis 포트
      }
    }),
    BullModule.registerQueue({
      name: 'docker-queue' // 큐 이름
    })
  ],
  controllers: [DockerController],
  providers: [DockerProducer, DockerConsumer, DockerContainerPool],
  exports: [DockerProducer]
})
export class DockerModule {}
