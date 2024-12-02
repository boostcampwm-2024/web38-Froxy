import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bull';
import { DockerContainerPool } from './docker.pool';

@Injectable()
export class DockerProducer implements OnApplicationBootstrap {
  cnt = 0;
  constructor(
    @InjectQueue('docker-queue')
    private readonly dockerQueue: Queue,
    private dockerContainerPool: DockerContainerPool
  ) {}
  onApplicationBootstrap() {
    this.dockerQueue.setMaxListeners(100);
  }

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
        jobId: `${Date.now()}`,
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: true
      }
    );

    return job.finished();
  }
}
