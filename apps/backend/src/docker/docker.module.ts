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
    BullModule.registerQueue({
      name: 'froxy-queue'
    })
  ],
  controllers: [DockerController],
  providers: [DockerProducer, DockerConsumer, DockerContainerPool],
  exports: [DockerProducer]
})
export class DockerModule {}
