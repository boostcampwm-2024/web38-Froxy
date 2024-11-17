import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LotusCreateDto } from './dto/lotus.create.dto';
import { LotusDto } from './dto/lotus.dto';
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
    gistUuid: string
  ): Promise<LotusCreateDto> {
    const commits = await this.gistService.getCommitsForAGist(gistUuid, 1, gitToken);
    if (commits.length < 1) {
      throw new HttpException('this gist repository has no commit.', HttpStatus.NOT_FOUND);
    }
    const currentCommitId = commits[0].commit_id;

    if (await this.checkAlreadyExist(gistUuid, currentCommitId)) {
      throw new HttpException('same commit Lotus already exist.', HttpStatus.CONFLICT);
    }
    const gitUser = await this.gistService.getUserData(gitToken);
    const userData = await this.userService.findOne(gitUser.id);
    await this.saveLotus(new LotusDto(title, isPublic, gistUuid, currentCommitId, userData));
    const lotusData = await this.lotusRepository.findOneBy({ gistRepositoryId: gistUuid, commitId: currentCommitId });

    return LotusCreateDto.ofSpreadData(SimpleUserResponseDto.ofUserDto(userData), lotusData);
  }

  async checkAlreadyExist(gistUuid: string, commitId: string) {
    return await this.lotusRepository.exists({ where: { gistRepositoryId: gistUuid, commitId: commitId } });
  }

  async saveLotus(lotus: Lotus): Promise<void> {
    await this.lotusRepository.save(lotus);
  }
}
