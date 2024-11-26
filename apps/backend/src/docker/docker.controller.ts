import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DockerProducer } from './docker.producer.js';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerProducer: DockerProducer, private configService: ConfigService) {}

  @Get('get')
  async getDockersTest(): Promise<string> {
    const mainFileName = 'FunctionDivide.js';
    // const gitToken = this.configService.get<string>('STATIC_GIST_ID');
    const gistId = this.configService.get<string>('DYNAMIC_GIST_ID');
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const commit = '654dd3f1d7f17d172132aebae283e73356197d18';
    const value = await this.dockerProducer.getDocker(
      gitToken,
      '25cf4713b2386b4ad4ce7c8dbbecebe8',
      'e717102aefed1f1f8b27b63eb7f46ce1f1516c86',
      'main.js',
      inputs
    );
    return value;
  }
}
