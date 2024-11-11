import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as tar from 'tar-stream';
import * as path from 'path';
import { promises as fs } from 'fs';

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
  docker =new Docker();

  async getDocker(gitToken:string, gistId: string, mainFileName: string): Promise<string>{
    const gistUrl = 'https://gist.github.com/username/gistid';
  
    return this.runGistFiles(gitToken,gistId, mainFileName)
      .then((result) => {
        console.log('Execution Result:', result)
        return result
      })
      .catch((error) => {
        console.error('Execution Error:', error)
        throw new Error("Execution Error")
      });
  }

  async runGistFiles(gitToken:string, gistId: string, mainFileName: string): Promise<string> {
    const docker = new Docker();
    const files = await this.fetchGistFiles(gitToken,gistId);
    
    // 컨테이너 생성
    const container = await docker.createContainer({
      Image: 'node:latest',
      Tty: true,//통합스트림
      OpenStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Env: [
        'NODE_DISABLE_COLORS=true',  // 색상 비활성화
        'TERM=dumb',                 // dumb 터미널로 설정하여 색상 비활성화
      ],
    });
  
    //desciption: 컨테이너 시작
    await container.start();

    //desciption: tar 아카이브를 생성
    const tarBuffer = await new Promise<Buffer>((resolve, reject) => {
      const pack = tar.pack();
      
      for (const file of files) {
        //desciption: 파일 이름과 내용을 tar 아카이브에 추가
        pack.entry({ name: file.name }, file.content, (err) => {
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
    //desciption: tarBuffer를 Docker 컨테이너에 업로드
    await container.putArchive(tarBuffer, { path: '/' });
  
    //desciption: 실행 결과를 캡처하기 위한 Exec 생성
    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['node', mainFileName],
    }); 
  
    const stream = await exec.start({hijack: true,stdin: true});
    let output = '';
    const inputContent = "처음\n둘\n셋\n넷\n다섯"; // 입력값 배열
    const inputs = inputContent.split("\n")
    for (const input of inputs) {
      await stream.write(input + '\n');
      await this.delay(100);//각 입력 term
    }
    stream.end();
    
    //desciption: 스트림에서 데이터 수집
    stream.on('data', (chunk) => {
      console.log("===========================");
      console.log(chunk.toString());

      output += chunk.toString();
    });
    //desciption: 스트림 종료 후 결과 반환
    return new Promise((resolve, reject) => {
      stream.on('end',async () => {
        await container.remove({force: true});
        const result = output.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\r]/g, '').replaceAll("\n)","\n").trim();
        console.log(JSON.stringify(result));
        resolve(result);

      });
      stream.on('error', reject);
    });
  }

  async fetchGistFiles(gitToken:string, gistId:string): Promise<{ name: string; content: string }[]> {
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`,{
        headers:{
          Authorization: `Bearer ${gitToken}`
        },
        method:"GET"
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

  delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
