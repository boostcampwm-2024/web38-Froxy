import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DockerContainerPool } from './docker.pool';

@Injectable()
export class DockerProducer {
  cnt = 0;
  constructor(
    @InjectQueue('docker-queue')
    private readonly dockerQueue,
    private dockerContainerPool: DockerContainerPool
  ) {}

  async getDocker(
    gitToken: string,
    gistId: string,
    commitId: string,
    mainFileName: string,
    inputs: any[]
  ): Promise<string> {
    this.cnt++;
    const c = this.cnt;
    const job = await this.dockerQueue.add(
      'always-docker-run',
      {
        gitToken,
        gistId: gistId,
        commitId: commitId,
        mainFileName,
        inputs,
        c
      },
      {
        jobid: `${Date.now()}`,
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: true
      }
    );

    return job.finished();
  }
}
