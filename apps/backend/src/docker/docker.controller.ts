import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DockerProducer } from './docker.producer.js';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerProducer: DockerProducer, private configService: ConfigService) {}

  @Get('get')
  async getDockersTest(): Promise<string> {
    try {
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
      console.log(value);
      return value;
    } catch (e) {
      console.error(e.message);
      return e.message;
    }
  }

  @Get('get2')
  async getDockersTest2(): Promise<string> {
    try {
      const gitToken = this.configService.get<string>('GIT_TOKEN');
      const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
      const value = await this.dockerProducer.getDocker(
        gitToken,
        '7f93da28e2522409a2274eff51b5dc20',
        '57944932d1ec6f05415b5e067f23c8a358e79d84',
        'main.js',
        inputs
      );
      console.log(value);
      return value;
    } catch (e) {
      console.error(e.message);
      return e.message;
    }
  }

  @Get('get3')
  async getDockersTest3(): Promise<string> {
    //무한루프
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    try {
      const value = await this.dockerProducer.getDocker(
        gitToken,
        '2574b42a40e9ea6d35a9434a88694720',
        '2b98cc9dd44bf0c8ddf43a715d2443d7261e25fc',
        'main.js',
        inputs
      );
      console.log(value);
      return value;
    } catch (e) {
      console.error(e.message);
      return e.message;
    }
  }
}
