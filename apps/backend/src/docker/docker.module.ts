import { Module } from '@nestjs/common';
import { DockerController } from './docker.controller.js';
import { DockerService } from './docker.service.js';

@Module({
  controllers: [DockerController],
  providers: [DockerService],
  exports: [DockerService]
})
export class DockerModule {}
