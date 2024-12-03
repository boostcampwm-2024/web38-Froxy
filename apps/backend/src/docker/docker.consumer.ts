import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Job } from 'bull';
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

@Processor('always-queue')
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
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs);
      return result;
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    } finally {
      await this.cleanWorkDir(container);
      this.dockerContainerPool.returnContainer(container);
    }
  }

  @Process({ name: 'always-docker-run', concurrency: 5 })
  async alwaysDockerRun(job: Job) {
    const { gitToken, gistId, commitId, mainFileName, inputs, c } = job.data;
    let container;
    try {
      console.log(`${c}번째 프로세스 시작`);
      container = await this.dockerContainerPool.getContainer();
      console.log(`${c}번째 프로세스: ${container.id}`);
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs);
      await this.cleanWorkDir(container);
      this.dockerContainerPool.pool.push(container);
      return result;
    } catch (error) {
      await this.cleanWorkDir(container);
      this.dockerContainerPool.pool.push(container);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }

  @Process({ name: 'multipleIO-docker-run' })
  async multipleIODockerRun(job: Job) {
    const { gitToken, gistId, commitId, mainFileName, inputs, c } = job.data;

    let container;
    try {
      container = await this.dockerContainerPool.pool[0];
      const result = await this.runGistFiles(container, gitToken, gistId, commitId, mainFileName, inputs);
      await this.cleanWorkDir(container);
      return result;
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    } finally {
      await this.cleanWorkDir(container);
    }
  }
  async runGistFiles(
    container: Container,
    gitToken: string,
    gistId: string,
    commitId: string,
    mainFileName: string,
    inputs: any[]
  ): Promise<string> {
    const gistData: GistApiFileListDto = await this.gistService.getCommit(gistId, commitId, gitToken);
    const files: GistApiFileDto[] = gistData.files;
    if (!files || !files.some((file) => file.fileName === mainFileName)) {
      throw new HttpException('execFile is not found', HttpStatus.NOT_FOUND);
    }
    //desciption: 컨테이너 시작
    const tarBuffer = await this.parseTarBuffer(files);

    //desciption: tarBuffer를 Docker 컨테이너에 업로드
    await container.putArchive(tarBuffer, { path: `/tmp` });
    if (files.some((file) => file.fileName === 'package.json')) {
      await this.packageInstall(container);
    }
    const stream = await this.dockerExcution(inputs, mainFileName, container);
    let output = '';
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
      stream.on('error', reject);
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
  async dockerExcution(inputs: any[], mainFileName: string, container: Container) {
    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: inputs.length !== 0, //true
      Cmd: ['node', mainFileName, '--exit'],
      workingDir: `/tmp`
    });
    //todo: 입력값이 없으면 스킵
    const stream = await exec.start({ hijack: true, stdin: true });
    for (const input of inputs) {
      await stream.write(input + '\n');
      await this.delay(100); //각 입력 term
    }

    // stream.end();
    return stream;
  }

  async packageInstall(container: Container): Promise<void> {
    const exec = await container.exec({
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['npm', 'install'],
      workingDir: `/tmp`
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

  async cleanWorkDir(container: Container): Promise<void> {
    try {
      const exec = await container.exec({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['sh', '-c', 'rm -rf /tmp/*']
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
