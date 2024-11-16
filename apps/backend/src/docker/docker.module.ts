import { Module } from '@nestjs/common';
import { DockerController } from './docker.controller.js';
import { DockerService } from './docker.service.js';
import { GistModule } from '@/gist/gist.module';

@Module({
  imports: [GistModule],
  controllers: [DockerController],
  providers: [DockerService],
  exports: [DockerService]
})
export class DockerModule {}
