import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { title } from 'process';
import { In, Like } from 'typeorm';
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
    const foundUser = await this.userService.findOneByUserId(userIdWhoWantToUpdate);
    if (!foundUser) throw new HttpException('user data not found', HttpStatus.NOT_FOUND);
    const updateLotus = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['user', 'tags']
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
    const result = await this.lotusRepository.save(updateLotus);
    if (!result) throw new HttpException('update fail', HttpStatus.BAD_REQUEST);
    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(updateLotus.user), updateLotus);
  }

  async deleteLotus(lotusId: string, userIdWhoWantToDelete: string): Promise<MessageDto> {
    const foundUser = await this.userService.findOneByUserId(userIdWhoWantToDelete);
    if (!foundUser) throw new HttpException('user data not found', HttpStatus.NOT_FOUND);
    const deleteLotus = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['user']
    });
    if (!deleteLotus) throw new HttpException('lotusId is not exist', HttpStatus.NOT_FOUND);
    if (deleteLotus.user.userId !== userIdWhoWantToDelete) {
      throw new HttpException("can't remove this lotus", HttpStatus.FORBIDDEN);
    }

    const result = await this.lotusRepository.delete({ lotusId });
    if (!result.affected) throw new HttpException('delete fail', HttpStatus.NOT_FOUND);

    return new MessageDto('ok');
  }

  async getLotusFile(userId: string, gitToken: string, lotusId: string): Promise<LotusDetailDto> {
    const lotusData = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['tags', 'user']
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
    //const [lotusData, totalNum] = await this.getLotusByTags(page, size, search);
    const [lotusData, totalNum] = await this.getLotusByTitle(page, size, search);
    const maxPage = Math.ceil(totalNum / size);
    if (page > maxPage && maxPage !== 0) {
      throw new HttpException('page must be lower than max page', HttpStatus.NOT_FOUND);
    }
    if (page <= 0) {
      throw new HttpException('page must be higher than 0', HttpStatus.NOT_FOUND);
    }
    return LotusPublicDto.ofLotusList(lotusData, page, maxPage);
  }

  async getLotusByTitle(page: number, size: number, search: string) {
    const whereData = {
      isPublic: true
    };
    if (search) {
      whereData['title'] = Like(`%${search}%`);
    }
    return await this.lotusRepository.findAndCount({
      where: whereData,
      skip: (page - 1) * size,
      take: size,
      relations: ['tags', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getLotusByTags(page: number, size: number, search: string) {
    const whereData = {
      isPublic: true
    };
    if (search) {
      const tags = await this.tagService.searchTag(search);
      whereData['tags'] = { tagId: In(tags) };
    }
    return await this.lotusRepository.findAndCount({
      where: whereData,
      skip: (page - 1) * size,
      take: size,
      relations: ['tags', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserLotus(userId: string, page: number, size: number) {
    const user = this.userService.findOneByUserId(userId);
    if (!user) {
      throw new HttpException('user data is not found', HttpStatus.UNAUTHORIZED);
    }

    const [lotusData, totalNum] = await this.lotusRepository.findAndCount({
      where: { user: { userId } },
      skip: (page - 1) * size,
      take: size,
      relations: ['tags', 'user'],
      order: { createdAt: 'DESC' }
    });
    const maxPage = Math.ceil(totalNum / size);
    if (page > maxPage && maxPage !== 0) {
      throw new HttpException('page must be lower than max page', HttpStatus.NOT_FOUND);
    }
    if (page <= 0) {
      throw new HttpException('page must be higher than 0', HttpStatus.NOT_FOUND);
    }
    return LotusPublicDto.ofLotusList(lotusData, page, maxPage);
  }

  async checkAlreadyExist(gistUuid: string, commitId: string) {
    return await this.lotusRepository.exists({ where: { gistRepositoryId: gistUuid, commitId: commitId } });
  }

  async saveLotus(lotus: Lotus): Promise<void> {
    await this.lotusRepository.save(lotus);
  }
}
