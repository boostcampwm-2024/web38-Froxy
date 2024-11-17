import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LotusResponseDto } from './dto/lotus.response.dto';
import { LotusService } from './lotus.service';

@Controller('lotus')
export class LotusController {
  constructor(private readonly lotusService: LotusService, private configService: ConfigService) {}

  @Post()
  createLotus(
    @Body('title') title: string,
    @Body('isPublic') isPublic: boolean,
    @Body('tag') tag: string[],
    @Body('gistUuid') gistUuid: string
  ): Promise<LotusResponseDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.createLotus(gitToken, title, isPublic, tag, gistUuid);
  }

  @Patch()
  updateLotus(
    @Query('lotusId') lotusId: string,
    @Body('title') title: string,
    @Body('tag') tag: string[],
    @Body('isPublic') isPublic: boolean
  ): Promise<LotusResponseDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.updateLotus(lotusId, title, tag, isPublic);
  }
}
