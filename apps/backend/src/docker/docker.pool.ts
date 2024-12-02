import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { MAX_CONTAINER_CNT } from '@/constants/constants';

@Injectable()
export class DockerContainerPool implements OnApplicationBootstrap {
  docker = new Docker();
  pool: Container[] = [];
  lock = false;
  async onApplicationBootstrap() {
    await this.createContainer();
  }

  async createContainer() {
    for (let i = 0; i < MAX_CONTAINER_CNT; i++) {
      const container = await this.docker.createContainer({
        Image: 'node:latest',
        Tty: false,
        OpenStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Env: [
          'NODE_DISABLE_COLORS=true', // 색상 비활성화
          'TERM=dumb' // dumb 터미널로 설정하여 색상 비활성화
        ]
      });
      this.pool.push(container);
    }
  }

  async getContainer(): Container | null {
    while (this.lock || this.pool.length === 0) {
      await this.delay(10); // 풀 비어 있음 처리
    }
    this.lock = true;
    const container = this.pool.pop();
    this.lock = false;
    return container;
  }

  async returnContainer(container: Container) {
    await container.stop();
    this.pool.push(container);
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
