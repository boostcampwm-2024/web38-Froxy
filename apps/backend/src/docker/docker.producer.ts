import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DockerContainerPool } from './docker.pool';

@Injectable()
export class DockerProducer {
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
    const startTime = Date.now();
    inputs = [1, 2];
    const job = await this.dockerQueue.add(
      'docker-run',
      {
        gitToken,
        gistId: gistId,
        commitId: commitId,
        mainFileName,
        inputs
      },
      { jobid: `${startTime}`, removeOnComplete: true, removeOnFail: true }
    );

    // Job 완료 대기 및 결과 반환
    return new Promise((resolve, reject) => {
      job
        .finished()
        .then((result) => {
          const endTime = Date.now();
          console.log(`처리시간 ${(endTime - startTime) / 1000}sec`);
          console.log(`Job${job.id} finished:`, result);
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  }
}
