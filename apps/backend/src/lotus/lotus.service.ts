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
    if (!lotusInputData.language) {
      lotusInputData.language = 'JavaScript';
    }
    if (!lotusInputData.version) {
      lotusInputData.version = 'NodeJs:v22.11.0';
    }
    const commits = await this.gistService.getCommitsForAGist(lotusInputData.gistUuid, 1, gitToken);
    if (commits.length < 1) {
      throw new HttpException('this gist repository has no commit.', HttpStatus.NOT_FOUND);
    }
    const currentCommitId = commits[0].commitId;

    if (await this.checkAlreadyExist(lotusInputData.gistUuid, currentCommitId)) {
      throw new HttpException('same commit Lotus already exist.', HttpStatus.CONFLICT);
    }
    const userData = await this.userService.findOneByUserId(userId);
    const tags: Tag[] = await Promise.all(
      lotusInputData.tags.map((tag) => {
        return this.tagService.getTag(tag);
      })
    );
    await this.saveLotus(new LotusDto(currentCommitId, userData, lotusInputData, tags));
    const lotusData = await this.lotusRepository.findOne({
      where: { gistRepositoryId: lotusInputData.gistUuid, commitId: currentCommitId },
      relations: ['tags']
    });

    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(userData), lotusData);
  }

  async updateLotus(
    lotusId: string,
    lotusUpdateRequestDto: LotusUpdateRequestDto,
    userIdWhoWantToUpdate: string
  ): Promise<LotusResponseDto> {
    const updateLotus = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['user', 'tags']
    });
    if (updateLotus.user.userId !== userIdWhoWantToUpdate) {
      throw new HttpException('this is not allowed req', HttpStatus.FORBIDDEN);
    }
    if (!updateLotus) throw new HttpException('invalid lotusId', HttpStatus.NOT_FOUND);
    if (lotusUpdateRequestDto.tags) {
      const tags = await Promise.all(lotusUpdateRequestDto.tags.map((tag) => this.tagService.getTag(tag)));
      updateLotus.tags = tags;
    }
    if (lotusUpdateRequestDto.title) {
      updateLotus.title = lotusUpdateRequestDto.title;
    }
    if (lotusUpdateRequestDto.isPublic !== undefined) {
      updateLotus.isPublic = lotusUpdateRequestDto.isPublic;
    }
    const result = await this.lotusRepository.save(updateLotus);
    if (!result) throw new HttpException('update fail', HttpStatus.BAD_REQUEST);
    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(updateLotus.user), updateLotus);
  }

  async deleteLotus(lotusId: string, userIdWhoWantToDelete: string): Promise<MessageDto> {
    const deleteLotus = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['user']
    });
    if (deleteLotus.user.userId !== userIdWhoWantToDelete) {
      throw new HttpException('this is not allowed req', HttpStatus.FORBIDDEN);
    }

    const result = await this.lotusRepository.delete({ lotusId });
    if (!result.affected) throw new HttpException('no match data', HttpStatus.NOT_FOUND);

    return new MessageDto('ok');
  }

  async getLotusFile(userId: string, gitToken: string, lotusId: string): Promise<LotusDetailDto> {
    const lotusData = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['tags', 'user']
    });
    if (!lotusData.isPublic && lotusData.user.userId !== userId) {
      throw new HttpException("this user can't access that lotus", HttpStatus.NOT_ACCEPTABLE);
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
    const firstIdx = size * (page - 1);
    const returnLotusData = lotusData.splice(firstIdx, size);

    return LotusPublicDto.ofLotusList(returnLotusData, page, Math.ceil(totalNum / size));
  }

  async getUserLotus(userId: string, page: number, size: number) {
    const lotusData = await this.lotusRepository.find({
      where: { user: { userId } },
      relations: ['tags', 'user']
    });
    const totalNum = lotusData.length;
    const firstIdx = size * (page - 1);
    const returnLotusData = lotusData.splice(firstIdx, size);

    return LotusPublicDto.ofLotusList(returnLotusData, page, Math.ceil(totalNum / size));
  }

  async checkAlreadyExist(gistUuid: string, commitId: string) {
    return await this.lotusRepository.exists({ where: { gistRepositoryId: gistUuid, commitId: commitId } });
  }

  async saveLotus(lotus: Lotus): Promise<void> {
    await this.lotusRepository.save(lotus);
  }
}
