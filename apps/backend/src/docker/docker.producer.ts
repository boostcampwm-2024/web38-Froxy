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
    const job = await this.dockerQueue.add(
      'docker-run',
      {
        gitToken,
        gistId,
        commitId,
        mainFileName,
        inputs
      },
      { removeOnComplete: true, removeOnFail: true }
    );
    // Job 완료 대기 및 결과 반환
    return new Promise((resolve, reject) => {
      job
        .finished()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  }
}
