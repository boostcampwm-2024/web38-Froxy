import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { UserService } from '@/user/user.service';

@Injectable()
export class LotusService {
  constructor(
    private readonly lotusRepository: LotusRepository,
    private readonly gistService: GistService,
    private readonly userService: UserService
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
    await this.saveLotus(new LotusDto(currentCommitId, userData, lotusInputData));
    const lotusData = await this.lotusRepository.findOne({
      where: { gistRepositoryId: lotusInputData.gistUuid, commitId: currentCommitId },
      relations: ['category']
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
      relations: ['user']
    });
    if (updateLotus.user.userId !== userIdWhoWantToUpdate) {
      throw new HttpException('this is not allowed req', HttpStatus.FORBIDDEN);
    }
    if (!updateLotus) throw new HttpException('invalid lotusId', HttpStatus.NOT_FOUND);
    const result = await this.lotusRepository.update(
      { lotusId },
      { title: lotusUpdateRequestDto.title, isPublic: lotusUpdateRequestDto.isPublic }
    );
    if (!result.affected) throw new HttpException('update fail', HttpStatus.BAD_REQUEST);
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

  async getLotusFile(gitToken: string, lotusId: string): Promise<LotusDetailDto> {
    const lotusData = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['category', 'user']
    });
    // todo : 이거 gist 정책 따라서 private 이어도 내부 볼 수 있게 해야 하나? 혹은 private이면 남들도 절대 못 보게?
    // if (!lotusData.isPublic && lotusData.user.gitToken !== gitToken) {
    //   throw new HttpException("this user can't access that lotus", HttpStatus.NOT_ACCEPTABLE);
    // }

    const commitFiles = await this.gistService.getCommit(lotusData.gistRepositoryId, lotusData.commitId, gitToken);

    return LotusDetailDto.ofGistFileListDto(commitFiles, lotusData);
  }

  async getPublicLotus(page = 1, size = 10, search: string): Promise<LotusPublicDto> {
    const lotusData = await this.lotusRepository.find({
      where: { isPublic: true },
      relations: ['category', 'user']
    });

    const totalNum = lotusData.length;
    const firstIdx = size * (page - 1);
    const returnLotusData = lotusData.splice(firstIdx, size);

    return LotusPublicDto.ofLotusList(returnLotusData, page, Math.ceil(totalNum / size));
  }

  async getUserLotus(userId: string, page = 1, size = 10) {
    const lotusData = await this.lotusRepository.find({
      where: { user: { userId } },
      relations: ['category', 'user']
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
