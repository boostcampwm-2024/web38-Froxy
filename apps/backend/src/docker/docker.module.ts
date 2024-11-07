import { Module } from '@nestjs/common';
import { DockerController } from './docker.controller.js';
import { DockerService } from './docker.service.js';

@Module({
  imports: [],
  controllers: [DockerController],
  providers: [DockerService]
})
export class DockerModule {}
