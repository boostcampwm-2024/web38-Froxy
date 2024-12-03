import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bull';
import { error } from 'console';
import { DockerContainerPool } from './docker.pool';

@Injectable()
export class DockerProducer implements OnApplicationBootstrap {
  cnt = 0;
  constructor(
    @InjectQueue('always-queue')
    private readonly dockerQueue: Queue,
    private dockerContainerPool: DockerContainerPool
  ) {}
  onApplicationBootstrap() {
    this.dockerQueue.setMaxListeners(1000);
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
    try {
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
          jobId: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          removeOnComplete: true,
          removeOnFail: true
        }
      );
      console.log('jobId추가 :', job.id);
      return await job.finished();
    } catch (error) {
      throw error;
    }
  }
}
