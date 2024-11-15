import { Injectable } from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { DockerService } from '@/docker/docker.service';
import { GistApiFileListDto } from '@/gist/dto/gistApiFileList.dto';
import { GistService } from '@/gist/gist.service';
import { Lotus } from '@/lotus/lotus.entity';
import { LotusRepository } from '@/lotus/lotus.repository';

@Injectable()
export class HistoryService {
  constructor(
    private HistoryRepository: HistoryRepository,
    private dockerService: DockerService,
    private lotusRepository: LotusRepository,
    private gistService: GistService
  ) {}
  async saveHistory(gitToken: string, lotusId: string, execFilename: string, inputs: string[]): Promise<string> {
    const [lotus]: Lotus[] = await this.lotusRepository.findBy({ lotusId: Number(lotusId) });
    const file: GistApiFileListDto = await this.gistService.getGistById(''); //lotus.gistRepositoryId
    this.HistoryRepository.save({
      commitId: file.id,
      exec_filename: execFilename,
      input: JSON.stringify(inputs),
      result: null,
      status: 'PENDING',
      lotus: lotus
    });
    this.execContainer(gitToken, lotus.gistRepositoryId, execFilename, inputs);
    return new Promise((resolve, reject) => resolve('gd'));
  }

  async execContainer(gitToken: string, lotusId: string, execFilename: string, inputs: string[]) {
    const result = await this.dockerService.getDocker(gitToken, lotusId, execFilename, inputs);
  }
}
