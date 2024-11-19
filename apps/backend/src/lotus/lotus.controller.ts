import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusPublicDto } from './dto/lotus.public.dto';
import { LotusResponseDto } from './dto/lotus.response.dto';
import { MessageDto } from './dto/message.dto';
import { LotusService } from './lotus.service';
import { AuthService } from '@/auth/auth.service';

@Controller('lotus')
export class LotusController {
  constructor(
    private readonly lotusService: LotusService,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  @Post()
  async createLotus(
    @Req() request: Request,
    @Body('title') title: string,
    @Body('isPublic') isPublic: boolean,
    @Body('tag') tag: string[],
    @Body('gistUuid') gistUuid: string,
    @Body('language') language: string,
    @Body('version') version: string
  ): Promise<LotusResponseDto> {
    const userId = this.authService.getIdFromRequest(request);
    const gitToken = await this.authService.getUserGitToken(userId);
    return await this.lotusService.createLotus(userId, gitToken, title, isPublic, tag, gistUuid, language, version);
  }

  @Patch('/:lotusId')
  updateLotus(
    @Req() request: Request,
    @Param('lotusId') lotusId: string,
    @Body('title') title: string,
    @Body('tag') tag: string[],
    @Body('isPublic') isPublic: boolean
  ): Promise<LotusResponseDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.updateLotus(lotusId, title, tag, isPublic, userId);
  }

  @Delete('/:lotusId')
  deleteLotus(@Req() request: Request, @Param('lotusId') lotusId: string): Promise<MessageDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.deleteLotus(lotusId, userId);
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
  async getLotusDetail(@Req() request: Request, @Param('lotusId') lotusId: string): Promise<LotusDetailDto> {
    let gitToken = '';
    try {
      gitToken = await this.authService.getUserGitToken(this.authService.getIdFromRequest(request));
    } catch (e) {}
    return this.lotusService.getLotusFile(gitToken, lotusId);
  }
}
