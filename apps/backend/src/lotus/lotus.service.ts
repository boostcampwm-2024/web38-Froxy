import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { title } from 'process';
import { In } from 'typeorm';
import { LotusCreateRequestDto } from './dto/lotus.createRequest.dto';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusDto } from './dto/lotus.dto';
import { LotusPublicDto } from './dto/lotus.public.dto';
import { LotusResponseDto } from './dto/lotus.response.dto';
import { LotusUpdateRequestDto } from './dto/lotus.updateRequest.dto';
import { MessageDto } from './dto/message.dto';
import { SimpleUserResponseDto } from './dto/simple.user.response.dto';
import { Lotus } from './lotus.entity';
import { LotusRepository } from './lotus.repository';
import { GistService } from '@/gist/gist.service';
import { Tag } from '@/tag/tag.entity';
import { TagService } from '@/tag/tag.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class LotusService {
  constructor(
    private readonly lotusRepository: LotusRepository,
    private readonly gistService: GistService,
    private readonly userService: UserService,
    private readonly tagService: TagService
  ) {}
  async createLotus(
    userId: string,
    gitToken: string,
    lotusInputData: LotusCreateRequestDto
  ): Promise<LotusResponseDto> {
    if (!lotusInputData.title) {
      throw new HttpException("title can't use empty", HttpStatus.BAD_REQUEST);
    }
    if (!lotusInputData.language) {
      lotusInputData.language = 'JavaScript';
    }
    if (!lotusInputData.version) {
      lotusInputData.version = 'NodeJs:v22.11.0';
    }
    const commits = await this.gistService.getCommitsForAGist(lotusInputData.gistUuid, 1, gitToken);
    if (!commits || commits.length < 1) {
      throw new HttpException('gistId is not exist', HttpStatus.NOT_FOUND);
    }
    const currentCommitId = commits[0].commitId;

    if (await this.checkAlreadyExist(lotusInputData.gistUuid, currentCommitId)) {
      throw new HttpException('same commit Lotus already exist.', HttpStatus.CONFLICT);
    }
    const userData = await this.userService.findOneByUserId(userId).catch((error) => {
      throw new HttpException('user findOneByUserId query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    const tags: Tag[] = await Promise.all(
      lotusInputData.tags.map((tag) => {
        return this.tagService.getTag(tag);
      })
    );
    await this.saveLotus(new LotusDto(currentCommitId, userData, lotusInputData, tags));
    const lotusData = await this.lotusRepository
      .findOne({
        where: { gistRepositoryId: lotusInputData.gistUuid, commitId: currentCommitId },
        relations: ['tags']
      })
      .catch((error) => {
        throw new HttpException('lotus findOne query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });

    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(userData), lotusData);
  }

  async updateLotus(
    lotusId: string,
    lotusUpdateRequestDto: LotusUpdateRequestDto,
    userIdWhoWantToUpdate: string
  ): Promise<LotusResponseDto> {
    const foundUser = await this.userService.findOneByUserId(userIdWhoWantToUpdate);
    if (!foundUser) throw new HttpException('user data not found', HttpStatus.NOT_FOUND);
    const updateLotus = await this.lotusRepository
      .findOne({
        where: { lotusId },
        relations: ['user', 'tags']
      })
      .catch((error) => {
        throw new HttpException('lotus findOne query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    if (!updateLotus) throw new HttpException('lotusId is not exist', HttpStatus.NOT_FOUND);
    if (updateLotus.user.userId !== userIdWhoWantToUpdate) {
      throw new HttpException("can't modify this lotus", HttpStatus.FORBIDDEN);
    }

    if (lotusUpdateRequestDto.isPublic !== undefined) {
      updateLotus.isPublic = lotusUpdateRequestDto.isPublic;
    } else {
      if (!lotusUpdateRequestDto.title) {
        throw new HttpException("title can't use empty", HttpStatus.BAD_REQUEST);
      } else {
        updateLotus.title = lotusUpdateRequestDto.title;
      }
      if (lotusUpdateRequestDto.tags) {
        const tags = await Promise.all(lotusUpdateRequestDto.tags.map((tag) => this.tagService.getTag(tag)));
        updateLotus.tags = tags;
      }
    }
    const result = await this.lotusRepository.save(updateLotus).catch((error) => {
      throw new HttpException('lotus save query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    if (!result) throw new HttpException('update fail', HttpStatus.BAD_REQUEST);
    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(updateLotus.user), updateLotus);
  }

  async deleteLotus(lotusId: string, userIdWhoWantToDelete: string): Promise<MessageDto> {
    const foundUser = await this.userService.findOneByUserId(userIdWhoWantToDelete);
    if (!foundUser) throw new HttpException('user data not found', HttpStatus.NOT_FOUND);
    const deleteLotus = await this.lotusRepository
      .findOne({
        where: { lotusId },
        relations: ['user']
      })
      .catch((error) => {
        throw new HttpException('lotus findOne query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    if (!deleteLotus) throw new HttpException('lotusId is not exist', HttpStatus.NOT_FOUND);
    if (deleteLotus.user.userId !== userIdWhoWantToDelete) {
      throw new HttpException("can't remove this lotus", HttpStatus.FORBIDDEN);
    }

    const result = await this.lotusRepository.delete({ lotusId }).catch((error) => {
      throw new HttpException('lotus delete query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    if (!result.affected) throw new HttpException('delete fail', HttpStatus.NOT_FOUND);

    return new MessageDto('ok');
  }

  async getLotusFile(userId: string, gitToken: string, lotusId: string): Promise<LotusDetailDto> {
    const lotusData = await this.lotusRepository
      .findOne({
        where: { lotusId },
        relations: ['tags', 'user']
      })
      .catch((error) => {
        throw new HttpException('lotus findOne query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    if (!lotusData) {
      throw new HttpException('lotusId is not exist', HttpStatus.NOT_FOUND);
    }
    if (!lotusData.isPublic && lotusData.user.userId !== userId) {
      throw new HttpException("can't view this lotus", HttpStatus.FORBIDDEN);
    }

    const commitFiles = await this.gistService.getCommit(lotusData.gistRepositoryId, lotusData.commitId, gitToken);

    return LotusDetailDto.ofGistFileListDto(commitFiles, lotusData);
  }

  async getPublicLotus(page: number, size: number, search: string): Promise<LotusPublicDto> {
    const tags = await this.tagService.searchTag(search);

    const lotusData = await this.lotusRepository.find({
      where: {
        isPublic: true,
        tags: {
          tagId: In(tags)
        }
      },
      relations: ['tags', 'user']
    });

    const totalNum = lotusData.length;
    const maxPage = Math.ceil(totalNum / size);
    if (page > maxPage && maxPage !== 0) {
      throw new HttpException('page must be lower than max page', HttpStatus.NOT_FOUND);
    }
    if (page <= 0) {
      throw new HttpException('page must be higher than 0', HttpStatus.NOT_FOUND);
    }
    const firstIdx = size * (page - 1);
    const returnLotusData = lotusData.splice(firstIdx, size);

    return LotusPublicDto.ofLotusList(returnLotusData, page, maxPage);
  }

  async getUserLotus(userId: string, page: number, size: number) {
    const user = this.userService.findOneByUserId(userId);
    if (!user) {
      throw new HttpException('user data is not found', HttpStatus.NOT_FOUND);
    }

    const lotusData = await this.lotusRepository
      .find({
        where: { user: { userId } },
        relations: ['tags', 'user']
      })
      .catch((error) => {
        throw new HttpException('lotus find query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
    const totalNum = lotusData.length;
    const maxPage = Math.ceil(totalNum / size);
    if (page > maxPage && maxPage !== 0) {
      throw new HttpException('page must be lower than max page', HttpStatus.NOT_FOUND);
    }
    if (page <= 0) {
      throw new HttpException('page must be higher than 0', HttpStatus.NOT_FOUND);
    }
    const firstIdx = size * (page - 1);
    const returnLotusData = lotusData.splice(firstIdx, size);

    return LotusPublicDto.ofLotusList(returnLotusData, page, maxPage);
  }

  async checkAlreadyExist(gistUuid: string, commitId: string) {
    return await this.lotusRepository
      .exists({ where: { gistRepositoryId: gistUuid, commitId: commitId } })
      .catch((error) => {
        throw new HttpException('lotus exists query failed', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async saveLotus(lotus: Lotus): Promise<void> {
    await this.lotusRepository.save(lotus).catch((error) => {
      throw new HttpException('lotus save query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
