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
    private historyRepository: HistoryRepository,
    private dockerService: DockerService,
    private lotusRepository: LotusRepository,
    private gistService: GistService
  ) {}
  async saveHistory(gitToken: string, lotusId: string, execFilename: string, inputs: string[]): Promise<{ status }> {
    const [lotus]: Lotus[] = await this.lotusRepository.findBy({ lotusId: lotusId });
    const file: GistApiFileListDto = await this.gistService.getCommit(lotus.gistRepositoryId, lotus.commitId);
    // const file: GistApiFileListDto = await this.gistService.getCommit('0fd9d1999eae1c272bd071dc95f96f99','654dd3f1d7f17d172132aebae283e73356197d18');
    const history = await this.historyRepository.save({
      input: JSON.stringify(inputs),
      execFilename: execFilename,
      result: null,
      status: 'PENDING',
      lotus: lotus
    });
    console.log(history);
    this.execContainer(gitToken, lotus.gistRepositoryId, lotus.commitId, execFilename, inputs, history.history_id);
    return { status: 'PENDING' };
  }

  async execContainer(
    gitToken: string,
    lotusId: string,
    commitId: string,
    execFilename: string,
    inputs: string[],
    historyId: string
  ) {
    const result = await this.dockerService.getDocker(gitToken, lotusId, commitId, execFilename, inputs);
    console.log(historyId);
    const updatehistory = await this.historyRepository.update(historyId, { status: 'SUCCESS', result });
    console.log(updatehistory);
  }
}
