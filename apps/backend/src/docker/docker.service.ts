import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as tar from 'tar-stream';

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

  async getDocker(gistId: string, mainFileName: string): Promise<string>{
    const gistUrl = 'https://gist.github.com/username/gistid';
  
    return this.runGistFiles(gistId, mainFileName)
      .then((result) => {
        console.log('Execution Result:', result)
        return result
      })
      .catch((error) => {
        console.error('Execution Error:', error)
        throw new Error("Execution Error")
      });
  }

  async runGistFiles(gistId: string, mainFileName: string): Promise<string> {
    const docker = new Docker();
    const files = await this.fetchGistFiles(gistId);
    
    // 컨테이너 생성
    const container = await docker.createContainer({
      Image: 'node:latest',
      Tty: false,
      OpenStdin: true,
      AttachStdout: true,
      AttachStderr: true,
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
      Tty: false,
      Cmd: ['node', mainFileName],
    }); 
  
    const stream = await exec.start({hijack: true,stdin: true});
    let output = '';
    const inputs = ["처음", "둘", "셋","넷","다섯"]; // 입력값 배열
    for (const input of inputs) {
      stream.write(input + '\n'); // 각 입력을 컨테이너에 전송
    }
    stream.end();
    //desciption: 스트림에서 데이터 수집
    stream.on('data', (chunk) => {
      console.log(chunk.toString())
      output += chunk.toString();
    });
    //desciption: 스트림 종료 후 결과 반환
    return new Promise((resolve, reject) => {
      stream.on('end',async () => {
        //todo: await container.stop({force: true}); exited상태(log 남음)
        //todo: await container.remove({force: true}); 아예 삭제(log 안남음)
        resolve(output.trim())
      });
      stream.on('error', reject);
    });
  }

  async fetchGistFiles(gistId:string): Promise<{ name: string; content: string }[]> {
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`,{
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


}
