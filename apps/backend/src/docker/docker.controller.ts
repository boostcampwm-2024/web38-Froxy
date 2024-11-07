import { Controller, Get, Param } from '@nestjs/common';
import { DockerService } from './docker.service.js';
import { ConfigService } from '@nestjs/config';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService, private configService: ConfigService) {}

  @Get('get')
  async getDockersTest(): Promise<string>{
    const mainFileName = 'OriginalCode.js';
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    console.log(gitToken);
    return await this.dockerService.getDocker(gitToken, mainFileName);
  }
}
