import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { error } from 'console';
import { Container } from 'dockerode';
import * as tar from 'tar-stream';
import { DockerContainerPool } from './docker.pool';
import { MAX_CONTAINER_CNT } from '@/constants/constants';
import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';
import { GistApiFileListDto } from '@/gist/dto/gistApiFileList.dto';
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

@Processor('single-queue')
@Injectable()
export class DockerConsumer {
  queue_num = false;
  constructor(private gistService: GistService, private dockerContainerPool: DockerContainerPool) {}

  @Process({ name: 'dynamic-docker-run' })
  async dynamicDockerRun(job: Job) {
    const { gitToken, gistId, commitId, mainFileName, inputs } = job.data;
    let container;
    try {
      container = await this.dockerContainerPool.getContainer();
      await container.start();
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs, 1);
      return result;
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    } finally {
      await this.cleanWorkDir(container, 1);
      this.dockerContainerPool.returnContainer(container);
    }
  }

  @Process({ name: 'always-docker-run', concurrency: MAX_CONTAINER_CNT })
  async alwaysDockerRun(job: Job) {
    const { gitToken, gistId, commitId, mainFileName, inputs, c } = job.data;
    let container;
    try {
      console.log(`${c}번째 프로세스 시작`);
      container = await this.dockerContainerPool.getContainer();
      const containerInfo = await container.inspect();
      console.log(`${c}번째 작업 컨테이너 할당: ${containerInfo.Name}`);
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs, 1);
      await this.cleanWorkDir(container, 1);
      this.dockerContainerPool.pool.push(container);
      console.log(`${c}번째 작업 컨테이너 반납: ${containerInfo.Name}`);
      console.log(`${c}번째 프로세스 종료`);
      return result;
    } catch (error) {
      await this.cleanWorkDir(container, 1);
      this.dockerContainerPool.pool.push(container);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }

  @Process({ name: 'multipleIO-docker-run' })
  async multipleIODockerRun(job: Job) {
    const { gitToken, gistId, commitId, mainFileName, inputs, c } = job.data;
    let container;
    try {
      console.log(`${c}번째 프로세스 시작`);
      container = await this.dockerContainerPool.pool[0];
      const containerInfo = await container.inspect();
      console.log(`${c}번째 작업 컨테이너 할당: ${containerInfo.Name}`);
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs, c);
      await this.cleanWorkDir(container, c);
      return result;
    } catch (error) {
      await this.cleanWorkDir(container, c);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }
  async runGistFiles(
    container: Container,
    gitToken: string,
    gistId: string,
    commitId: string,
    mainFileName: string,
    inputs: any[],
    dirId: any
  ): Promise<string> {
    const gistData: GistApiFileListDto = await this.gistService.getCommit(gistId, commitId, gitToken);
    const files: GistApiFileDto[] = gistData.files;
    if (!files || !files.some((file) => file.fileName === mainFileName)) {
      throw new HttpException('execFile is not found', HttpStatus.NOT_FOUND);
    }
    await this.initWorkDir(container, dirId);
    //desciption: 컨테이너 시작
    const tarBuffer = await this.parseTarBuffer(files);

    //desciption: tarBuffer를 Docker 컨테이너에 업로드
    await container.putArchive(tarBuffer, { path: `/tmp/${dirId}` });
    if (files.some((file) => file.fileName === 'package.json')) {
      await this.packageInstall(container, 1);
    }
    const exec = await this.dockerExcution(inputs, mainFileName, container, 1);
    let output = '';
    const stream = await exec.start({ hijack: true, stdin: true });
    return new Promise((resolve, reject) => {
      let time = null;

      const onStreamClose = async () => {
        try {
          let result = await this.filterAnsiCode(output);
          clearTimeout(time);
          if (inputs.length !== 0) {
            result = result.split('\n').slice(1).join('\n');
          }
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      // Timeout 설정
      time = setTimeout(() => {
        stream.destroy(new Error('Timeout'));
      }, 10000);

      // 스트림에서 데이터 수집
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      // 스트림 종료 대기
      stream.on('close', onStreamClose);
      stream.on('end', onStreamClose);
      stream.on('error', (err) => {
        reject(err);
      });

      (async () => {
        try {
          for (const input of inputs) {
            if (!stream.destroyed && stream.writable) {
              await stream.write(input + '\n');
            }
            await this.delay(100); //각 입력 term
          }
        } catch (err) {
          reject(err);
        }
      })();
    });
  }

  async fetchGistFiles(gitToken: string, gistId: string): Promise<{ name: string; content: string }[]> {
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          Authorization: `Bearer ${gitToken}`
        },
        method: 'GET'
      });
      const json = await response.json();
      const files: GistFile = json.files;

      const fileData: { name: string; content: string }[] = [];
      for (const [fileName, file] of Object.entries(files)) {
        fileData.push({ name: fileName, content: file.content });
      }
      return fileData;
    } catch (error) {
      throw new Error('Failed to fetch Gist files');
    }
  }

  async parseTarBuffer(files: GistApiFileDto[]): Promise<Buffer> {
    //desciption: tar 아카이브를 생성
    return new Promise<Buffer>((resolve, reject) => {
      const pack = tar.pack();

      for (const file of files) {
        //desciption: 파일 이름과 내용을 tar 아카이브에 추가
        pack.entry({ name: file.fileName }, file.content, (err) => {
          if (err) reject(err);
        });
      }

      //desciption: 아카이브 완료
      pack.finalize();

      //desciption: Buffer로 변환
      const buffers: Buffer[] = [];
      pack.on('data', (data) => buffers.push(data));
      pack.on('end', () => resolve(Buffer.concat(buffers)));
      pack.on('error', reject);
    });
  }
  async dockerExcution(inputs: any[], mainFileName: string, container: Container, dirId: any) {
    console.log('함수들어옴');
    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: inputs.length !== 0, //true
      Cmd: ['node', mainFileName, '--exit'],
      workingDir: `/tmp/${dirId}`
    });

    return exec;
  }

  async packageInstall(container: Container, dirId): Promise<void> {
    const exec = await container.exec({
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['npm', 'install'],
      workingDir: `/tmp/${dirId}`
    });

    const stream = await exec.start();
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => {
        const c = chunk;
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }

  async cleanWorkDir(container: Container, dirId: any): Promise<void> {
    try {
      const exec = await container.exec({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['sh', '-c', `rm -rf /tmp/${dirId}`]
      });
      const stream = await exec.start();
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
          const c = chunk;
        });
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    } catch (error) {
      console.log(error.message);
      throw new Error('container tmp init failed');
    }
  }

  async initWorkDir(container: Container, dirId: any): Promise<void> {
    try {
      const exec = await container.exec({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['mkdir', `/tmp/${dirId}`]
      });
      const stream = await exec.start();
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
          const c = chunk;
        });
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    } catch (error) {
      console.log(error.message);
      throw new Error('container tmp init failed');
    }
  }

  filterAnsiCode(output: string): string {
    return output
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\r]/g, '')
      .replaceAll('\n)', '\n')
      .trim();
  }
  delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
