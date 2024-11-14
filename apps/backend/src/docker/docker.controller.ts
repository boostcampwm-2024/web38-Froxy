import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DockerService } from './docker.service.js';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService, private configService: ConfigService) {}

  @Get('get')
  async getDockersTest(): Promise<string> {
    const mainFileName = 'FunctionDivide.js';
    // const gitToken = this.configService.get<string>('STATIC_GIST_ID');
    // const gistId = this.configService.get<string>('DYNAMIC_GIST_ID');
    const gistId = '0fd9d1999eae1c272bd071dc95f96f99';
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const value = await this.dockerService.getDocker(gitToken, gistId, mainFileName, inputs);
    return value;
  }

  @Get('test')
  async docketTest(
    @Query('gist_id') gist_id: string,
    @Query('filename') filename: string,
    @Query('input') input: string
  ): Promise<string> {
    const mainFileName = `${filename}.js`;
    // const gitToken = this.configService.get<string>('STATIC_GIST_ID');
    // const gistId = this.configService.get<string>('DYNAMIC_GIST_ID');
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = input.split(',');
    const value = await this.dockerService.getDocker(gitToken, gist_id, mainFileName, inputs);
    return value;
  }
}
