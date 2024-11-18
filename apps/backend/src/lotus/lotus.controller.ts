import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusPublicDto } from './dto/lotus.public.dto';
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
    @Body('gistUuid') gistUuid: string,
    @Body('language') language: string,
    @Body('version') version: string
  ): Promise<LotusResponseDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.createLotus(gitToken, title, isPublic, tag, gistUuid, language, version);
  }

  @Patch('/:lotusId')
  updateLotus(
    @Param('lotusId') lotusId: string,
    @Body('title') title: string,
    @Body('tag') tag: string[],
    @Body('isPublic') isPublic: boolean
  ): Promise<LotusResponseDto> {
    return this.lotusService.updateLotus(lotusId, title, tag, isPublic);
  }

  @Delete('/:lotusId')
  deleteLotus(@Param('lotusId') lotusId: string): Promise<MessageDto> {
    return this.lotusService.deleteLotus(lotusId);
  }

  @Get()
  getPublicLotus(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('search') search: string
  ): Promise<LotusPublicDto> {
    return this.lotusService.getPublicLotus(page, size, search);
  }

  @Get('/:lotusId')
  getLotusDetail(@Param('lotusId') lotusId: string): Promise<LotusDetailDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.getLotusFile(gitToken, lotusId);
  }
}
