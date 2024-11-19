import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { LotusCreateRequestDto } from './dto/lotus.createRequest.dto';
import { LotusDetailDto } from './dto/lotus.detail.dto';
import { LotusPublicDto } from './dto/lotus.public.dto';
import { LotusResponseDto } from './dto/lotus.response.dto';
import { LotusUpdateRequestDto } from './dto/lotus.updateRequest.dto';
import { MessageDto } from './dto/message.dto';
import { LotusService } from './lotus.service';
import { AuthService } from '@/auth/auth.service';

@Controller('lotus')
export class LotusController {
  constructor(private readonly lotusService: LotusService, private authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'lotus 생성 및 추가' })
  @ApiBody({ type: LotusCreateRequestDto })
  @ApiResponse({ status: 201, description: '실행 성공', type: LotusResponseDto })
  async createLotus(
    @Req() request: Request,
    @Body() lotusCreateRequestDto: LotusCreateRequestDto
  ): Promise<LotusResponseDto> {
    const userId = this.authService.getIdFromRequest(request);
    const gitToken = await this.authService.getUserGitToken(userId);
    return await this.lotusService.createLotus(userId, gitToken, lotusCreateRequestDto);
  }

  @Patch('/:lotusId')
  @HttpCode(200)
  @ApiOperation({ summary: 'lotus 업데이트' })
  @ApiBody({ type: LotusCreateRequestDto })
  @ApiResponse({ status: 200, description: '실행 성공', type: LotusResponseDto })
  @ApiQuery({ name: 'lotusId', type: String, example: '25' })
  updateLotus(
    @Req() request: Request,
    @Param('lotusId') lotusId: string,
    @Body() lotusUpdateRequestDto: LotusUpdateRequestDto
  ): Promise<LotusResponseDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.updateLotus(lotusId, lotusUpdateRequestDto, userId);
  }

  @Delete('/:lotusId')
  @HttpCode(204)
  @ApiOperation({ summary: 'lotus 삭제' })
  @ApiResponse({ status: 204, description: '실행 성공', type: MessageDto })
  @ApiQuery({ name: 'lotusId', type: String, example: '25' })
  deleteLotus(@Req() request: Request, @Param('lotusId') lotusId: string): Promise<MessageDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.deleteLotus(lotusId, userId);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'lotus public 목록 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: LotusPublicDto })
  @ApiQuery({ name: 'page', type: String, example: '1', required: false })
  @ApiQuery({ name: 'size', type: String, example: '10', required: false })
  @ApiQuery({ name: 'search', type: String, example: 'Web', required: false })
  getPublicLotus(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('search') search: string
  ): Promise<LotusPublicDto> {
    return this.lotusService.getPublicLotus(page, size, search);
  }

  @Get('/:lotusId')
  @HttpCode(200)
  @ApiOperation({ summary: 'lotus 상세 데이터 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: LotusDetailDto })
  @ApiQuery({ name: 'lotusId', type: String, example: '25' })
  async getLotusDetail(@Req() request: Request, @Param('lotusId') lotusId: string): Promise<LotusDetailDto> {
    let gitToken = '';
    let userId = '-1';
    try {
      userId = this.authService.getIdFromRequest(request);
      gitToken = await this.authService.getUserGitToken(userId);
    } catch (e) {}
    return this.lotusService.getLotusFile(userId, gitToken, lotusId);
  }
}
