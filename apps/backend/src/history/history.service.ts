import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import e from 'express';
import { HistoryExecResponseDto } from './dto/history.execResponse.dto';
import { HistoryGetResponseDto } from './dto/history.getReponse.dto';
import { HistoryResponseListDto } from './dto/history.responseList.dto';
import { HistoryRepository } from './history.repository';
import { HISTORY_STATUS, SUPPORTED_LANGUAGES } from '@/constants/constants';
import { DockerProducer } from '@/docker/docker.producer';
import { GistApiFileListDto } from '@/gist/dto/gistApiFileList.dto';
import { GistService } from '@/gist/gist.service';
import { Lotus } from '@/lotus/lotus.entity';
import { LotusRepository } from '@/lotus/lotus.repository';

@Injectable()
export class HistoryService {
  constructor(
    private historyRepository: HistoryRepository,
    private dockerProducer: DockerProducer,
    private lotusRepository: LotusRepository,
    private gistService: GistService
  ) {}
  async saveHistory(gitToken: string, lotusId: string, execFilename: string, inputs: string[]): Promise<any> {
    const [lotus]: Lotus[] = await this.lotusRepository.findBy({ lotusId: lotusId });
    const file: GistApiFileListDto = await this.gistService.getCommit(lotus.gistRepositoryId, lotus.commitId, gitToken);
    if (!execFilename.endsWith(SUPPORTED_LANGUAGES.JS)) {
      throw new HttpException('not supported file extension', HttpStatus.BAD_REQUEST);
    }
    const history = await this.historyRepository.save({
      input: JSON.stringify(inputs),
      execFilename: execFilename,
      result: null,
      status: 'PENDING',
      lotus: lotus
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
      const result = await this.dockerProducer.getDocker(gitToken, lotusId, commitId, execFilename, inputs);
      await this.historyRepository.update(historyId, { status: HISTORY_STATUS.SUCCESS, result });
    } catch (error) {
      console.error(`HTTP ${404} Error: ${error.message} | Path: lotus/${lotusId}/history/${historyId}`);
      await this.historyRepository.update(historyId, {
        status: HISTORY_STATUS.ERROR,
        result: error.message
      });
    }
  }

  async getHistoryList(lotusId: string, page: number, size: number): Promise<HistoryResponseListDto> {
    const result = await this.historyRepository.findAndCount({
      where: { lotus: { lotusId } },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' }
    });
    const [historys, total] = result;
    const maxPage = Math.ceil(total / size);
    if (page > maxPage && maxPage !== 0) {
      throw new HttpException('page must be lower than max page', HttpStatus.NOT_FOUND);
    }
    if (page <= 0) {
      throw new HttpException('page must be higher than 0', HttpStatus.NOT_FOUND);
    }
    return HistoryResponseListDto.of(historys, page, size, maxPage);
  }
  async getHistoryFromId(historyId: string): Promise<HistoryGetResponseDto> {
    const history = await this.historyRepository.findOneBy({ historyId: historyId });
    if (!history) {
      throw new HttpException('not exist history', HttpStatus.BAD_REQUEST);
    }
    return HistoryGetResponseDto.of(history);
  }

  async errorQuery() {
    return await this.historyRepository.save({ status: HISTORY_STATUS.SUCCESS });
  }
}
