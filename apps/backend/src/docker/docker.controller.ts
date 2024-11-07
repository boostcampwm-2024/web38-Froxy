import { Controller, Get, Param } from '@nestjs/common';
import { DockerService } from './docker.service.js';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get('get')
  async getDockersTest(): Promise<string>{
    const mainFileName = 'OriginalCode.js';
    const gitToken = "";
    return await this.dockerService.getDocker(gitToken, mainFileName);
  }
}
