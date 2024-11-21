import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as tar from 'tar-stream';
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

@Injectable()
export class DockerService {
  docker = new Docker();
  constructor(private gistService: GistService) {}

  async getDocker(
    gitToken: string,
    gistId: string,
    commit_id: string,
    mainFileName: string,
    inputs: any[]
  ): Promise<string> {
    return this.runGistFiles(gitToken, gistId, commit_id, mainFileName, inputs)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(`Execution Error: ${error.message}`);
      });
  }

  async runGistFiles(
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

    // 컨테이너 생성
    const container = await this.docker.createContainer({
      //todo: image version맞춰야함
      Image: 'node:latest',
      Tty: inputs.length !== 0, //통합스트림
      OpenStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Env: [
        'NODE_DISABLE_COLORS=true', // 색상 비활성화
        'TERM=dumb' // dumb 터미널로 설정하여 색상 비활성화
      ]
    });

    //desciption: 컨테이너 시작
    await container.start();

    const tarBuffer = await this.parseTarBuffer(files);

    //desciption: tarBuffer를 Docker 컨테이너에 업로드
    await container.putArchive(tarBuffer, { path: '/' });

    const stream = await this.dockerExcution(inputs, mainFileName, container);
    let output = '';

    //desciption: 스트림에서 데이터 수집
    //todo: 입력값이 있으면 첫줄 slice
    stream.on('data', (chunk) => {
      output += chunk.toString();
    });

    //desciption: 스트림 종료 후 결과 반환
    return new Promise((resolve, reject) => {
      stream.on('end', async () => {
        await container.remove({ force: true });
        let result = this.filterAnsiCode(output);
        if (inputs.length !== 0) {
          result = result.split('\n').slice(1).join('\n');
        }
        resolve(result);
      });
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
      console.error('Error fetching Gist files:', error);
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
      Tty: inputs.length !== 0,
      Cmd: ['node', mainFileName]
    });

    //todo: 입력값이 없으면 스킵
    const stream = await exec.start({ hijack: true, stdin: true });
    for (const input of inputs) {
      await stream.write(input + '\n');
      await this.delay(100); //각 입력 term
    }
    stream.end();
    return stream;
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
