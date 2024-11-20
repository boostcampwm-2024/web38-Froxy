import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { HistoryExecRequestDto } from './dto/history.execRequest.dto';
import { HistoryExecResponseDto } from './dto/history.execResponse.dto';
import { HistoryGetResponseDto } from './dto/history.getReponse.dto';
import { HistoryResponseListDto } from './dto/history.responseList.dto';
import { HistoryService } from './history.service';
import { AuthService } from '@/auth/auth.service';
import { HISTORY_STATUS } from '@/constants/constants';

@Controller('lotus/:lotusId/history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '코드 실행 & history 추가' })
  @ApiBody({ type: HistoryExecRequestDto })
  @ApiResponse({ status: 200, description: '실행 성공', type: HistoryExecResponseDto })
  execCode(
    @Req() req: Request,
    @Param('lotusId') lotusId: string,
    @Body() historyExecRequestDto: HistoryExecRequestDto
  ): Promise<any> {
    const gitToken = req.headers['Authorization'] as string;

    // const execFileName = 'FunctionDivide.js';
    // const input = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const { input, execFileName } = historyExecRequestDto;
    return this.historyService.saveHistory(gitToken, lotusId, execFileName, input);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '해당 lotus의 history 목록 조회' })
  @ApiResponse({ status: 200, description: '실행 성공', type: HistoryResponseListDto })
  @ApiQuery({ name: 'page', type: Number, example: 1 })
  @ApiQuery({ name: 'size', type: Number, example: 5 })
  getHistoryList(
    @Param('lotusId') lotusId: string,
    @Query('page') page: number,
    @Query('size') size: number
  ): Promise<HistoryResponseListDto> {
    return this.historyService.getHistoryList(lotusId, page, size);
  }

  @Get(':historyId')
  @HttpCode(200)
  @ApiOperation({ summary: '해당 historyId의 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '실행 성공', type: HistoryGetResponseDto })
  getHistory(@Param('historyId') historyId: string): Promise<HistoryGetResponseDto> {
    return this.historyService.getHistoryFromId(historyId);
  }
}
