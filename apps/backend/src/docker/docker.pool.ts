import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container } from 'dockerode';
import { MAX_CONTAINER_CNT } from '@/constants/constants';

@Injectable()
export class DockerContainerPool implements OnApplicationBootstrap {
  docker = new Docker({ socketPath: '/var/run/docker.sock' });
  pool: Container[] = [];
  lock = false;
  async onApplicationBootstrap() {
    await this.clearContainer();
    await this.createAlwaysContainer();
  }

  async clearContainer() {
    const containersToDelete = await this.docker.listContainers({ all: true });
    await Promise.all(
      containersToDelete
        .filter((container) => container.Names.some((name) => name.startsWith('/froxy-run')))
        .map(async (container) => {
          const removeContainer = await this.docker.getContainer(container.Id);
          await removeContainer.remove({ force: true });
        })
    );
  }
  async createDynamicContainer() {
    for (let i = 0; i < MAX_CONTAINER_CNT; i++) {
      const container = await this.docker.createContainer({
        Image: 'node:latest',
        Tty: false,
        OpenStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Env: ['NODE_DISABLE_COLORS=true', 'TERM=dumb'],
        name: `froxy-run${i + 1}`,
        HostConfig: {
          Memory: 1024 * 1024 * 1024,
          MemorySwap: 1024 * 1024 * 1024
        }
      });
      this.pool.push(container);
    }
  }

  async createAlwaysContainer() {
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
        ],
        name: `froxy-run${i + 1}`,
        HostConfig: {
          Memory: 1024 * 1024 * 1024,
          MemorySwap: 1024 * 1024 * 1024,
          networkMode: 'host'
        }
      });
      container.start();

      this.pool.push(container);
    }
  }

  async createSingleContainer() {
    const container = await this.docker.createContainer({
      Image: 'node:latest',
      Tty: false,
      OpenStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Env: [
        'NODE_DISABLE_COLORS=true', // 색상 비활성화
        'TERM=dumb' // dumb 터미널로 설정하여 색상 비활성화
      ],
      name: `single-run`
    });
    container.start();
    this.pool.push(container);
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
