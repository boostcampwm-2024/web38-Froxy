import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusResponseDto } from './dto/lotus.response.dto';
import { MessageDto } from './dto/message.dto';
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
    return this.lotusService.updateLotus(lotusId, title, tag, isPublic);
  }

  @Delete()
  deleteLotus(@Query('lotusId') lotusId: string): Promise<MessageDto> {
    return this.lotusService.deleteLotus(lotusId);
  }

  @Get()
  getLotusDetail(@Query('lotusId') lotusId: string): Promise<LotusDetailDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.getLotusFile(gitToken, lotusId);
  }
}
