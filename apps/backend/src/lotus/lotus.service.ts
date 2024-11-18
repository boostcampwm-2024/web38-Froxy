import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusDto } from './dto/lotus.dto';
import { LotusPublicDto } from './dto/lotus.public.dto';
import { LotusResponseDto } from './dto/lotus.response.dto';
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
    gitToken: string,
    title: string,
    isPublic: boolean,
    tag: string[],
    gistUuid: string,
    inpLanguage: string,
    inpVersion: string
  ): Promise<LotusResponseDto> {
    const language = !inpLanguage ? 'NodeJs' : inpLanguage;
    const version: string = !inpVersion ? 'v22.11.0' : inpVersion;
    const commits = await this.gistService.getCommitsForAGist(gistUuid, 1, gitToken);
    if (commits.length < 1) {
      throw new HttpException('this gist repository has no commit.', HttpStatus.NOT_FOUND);
    }
    const currentCommitId = commits[0].commitId;

    if (await this.checkAlreadyExist(gistUuid, currentCommitId)) {
      throw new HttpException('same commit Lotus already exist.', HttpStatus.CONFLICT);
    }
    const gitUser = await this.gistService.getUserData(gitToken);
    const userData = await this.userService.findOne(gitUser.id);
    await this.saveLotus(new LotusDto(title, isPublic, gistUuid, currentCommitId, userData, language, version));
    const lotusData = await this.lotusRepository.findOne({
      where: { gistRepositoryId: gistUuid, commitId: currentCommitId },
      relations: ['category']
    });

    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(userData), lotusData);
  }

  async updateLotus(lotusId: string, title: string, tag: string[], isPublic: boolean): Promise<LotusResponseDto> {
    const result = await this.lotusRepository.update({ lotusId }, { title, isPublic });
    if (!result.affected) throw new HttpException('update fail', HttpStatus.BAD_REQUEST);
    const updateLotus = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['user']
    });
    if (!updateLotus) throw new HttpException('invalid lotusId', HttpStatus.NOT_FOUND);
    return LotusResponseDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(updateLotus.user), updateLotus);
  }

  async deleteLotus(lotusId: string): Promise<MessageDto> {
    const result = await this.lotusRepository.delete({ lotusId });
    if (!result.affected) throw new HttpException('no match data', HttpStatus.NOT_FOUND);

    return new MessageDto('ok');
  }

  async getLotusFile(gitToken: string, lotusId: string): Promise<LotusDetailDto> {
    const lotusData = await this.lotusRepository.findOne({
      where: { lotusId },
      relations: ['category', 'user']
    });
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
