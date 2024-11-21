import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HistoryExecResponseDto } from './dto/history.execResponse.dto';
import { HistoryGetResponseDto } from './dto/history.getReponse.dto';
import { HistoryResponseListDto } from './dto/history.responseList.dto';
import { HistoryRepository } from './history.repository';
import { HISTORY_STATUS, SUPPORTED_LANGUAGES } from '@/constants/constants';
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
  async saveHistory(gitToken: string, lotusId: string, execFilename: string, inputs: string[]): Promise<any> {
    const [lotus]: Lotus[] = await this.lotusRepository.findBy({ lotusId: lotusId });
    const file: GistApiFileListDto = await this.gistService.getCommit(lotus.gistRepositoryId, lotus.commitId, gitToken);
    if (!execFilename.endsWith(SUPPORTED_LANGUAGES.JS)) {
      throw new HttpException('not supported file extension', HttpStatus.BAD_REQUEST);
    }
    const history = await this.historyRepository
      .save({
        input: JSON.stringify(inputs),
        execFilename: execFilename,
        result: null,
        status: 'PENDING',
        lotus: lotus
      })
      .catch((error) => {
        throw new HttpException('history save query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    this.execContainer(gitToken, lotus.gistRepositoryId, lotus.commitId, execFilename, inputs, history.historyId);
    return HistoryExecResponseDto.of(HISTORY_STATUS.PENDING);
  }

  async execContainer(
    gitToken: string,
    lotusId: string,
    commitId: string,
    execFilename: string,
    inputs: string[],
    historyId: string
  ) {
    try {
      const result = await this.dockerService.getDocker(gitToken, lotusId, commitId, execFilename, inputs);
      const updatehistory = await this.historyRepository
        .update(historyId, { status: HISTORY_STATUS.SUCCESS, result })
        .catch((error) => {
          console.error('success history update query failed');
        });
    } catch (error) {
      const updatehistory = await this.historyRepository
        .update(historyId, {
          status: HISTORY_STATUS.ERROR,
          result: error.message
        })
        .catch((error) => {
          console.error('success history update query failed');
        });
    }
  }

  async getHistoryList(lotusId: string, page: number, size: number): Promise<HistoryResponseListDto> {
    const result = await this.historyRepository
      .findAndCount({
        where: { lotus: { lotusId } },
        skip: (page - 1) * size,
        take: size,
        order: { createdAt: 'DESC' }
      })
      .catch((error) => {
        throw new HttpException('history findAndCount query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    const [historys, total] = result;

    // if (historys.length === 0) {
    //   throw new HttpException('not exist history', HttpStatus.BAD_REQUEST);
    // }

    return HistoryResponseListDto.of(historys, page, size, total);
  }
  async getHistoryFromId(historyId: string): Promise<HistoryGetResponseDto> {
    const history = await this.historyRepository.findOneBy({ historyId: historyId }).catch((error) => {
      throw new HttpException('history findOneBy query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    if (!history) {
      throw new HttpException('not exist history', HttpStatus.BAD_REQUEST);
    }
    return HistoryGetResponseDto.of(history);
  }
}
