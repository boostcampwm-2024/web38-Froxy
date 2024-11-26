import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { GistService } from '@/gist/gist.service';

interface GistFileAttributes {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  truncated?: boolean;
  content?: string;
}

interface GistFile {
  filename: string;
  attr: GistFileAttributes;
}

@Injectable()
export class DockerProducer {
  docker = new Docker();
  constructor(@InjectQueue('docker-queue') private readonly dockerQueue) {}

  async getDocker(
    gitToken: string,
    gistId: string,
    commitId: string,
    mainFileName: string,
    inputs: any[]
  ): Promise<string> {
    const job = await this.dockerQueue.add('docker-run', {
      gitToken,
      gistId,
      commitId,
      mainFileName,
      inputs
    });
    // Job 완료 대기 및 결과 반환
    return new Promise((resolve, reject) => {
      job
        .finished()
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }
}
