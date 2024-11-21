import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DockerService } from './docker.service.js';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService, private configService: ConfigService) {}

  @Get('get')
  async getDockersTest(): Promise<string> {
    const mainFileName = 'FunctionDivide.js';
    // const gitToken = this.configService.get<string>('STATIC_GIST_ID');
    const gistId = this.configService.get<string>('DYNAMIC_GIST_ID');
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const commit = '654dd3f1d7f17d172132aebae283e73356197d18';
    const value = await this.dockerService.getDocker(gitToken, gistId, commit, mainFileName, inputs);
    return value;
  }
}
