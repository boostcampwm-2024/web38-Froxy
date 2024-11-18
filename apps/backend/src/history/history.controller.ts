import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HistoryExecRequestDto } from './dto/history.execRequest.dto';
import { HistoryGetResponseDto } from './dto/history.getReponse.dto';
import { HistoryResponseListDto } from './dto/history.responseList.dto';
import { HistoryService } from './history.service';
import { AuthService } from '@/auth/auth.service';

@Controller('lotus/:lotusId/history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private configService: ConfigService,
    private authServer: AuthService
  ) {}

  @Post()
  @HttpCode(200)
  execCode(
    @Headers('Authorization') token: string,
    @Param('lotusId') lotusId: string,
    @Body() historyExecRequestDto: HistoryExecRequestDto
  ): Promise<any> {
    const gitToken = this.authServer.verifyJwt(token).user_id;
    // const execFileName = 'FunctionDivide.js';
    // const input = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const { input, execFileName } = historyExecRequestDto;
    return this.historyService.saveHistory(gitToken, lotusId, execFileName, input);
  }

  @Get()
  @HttpCode(200)
  getHistoryList(
    @Param('lotusId') lotusId: string,
    @Query('page') page: number,
    @Query('size') size: number
  ): Promise<HistoryResponseListDto> {
    return this.historyService.getHistoryList(lotusId, page, size);
  }

  @Get(':historyId')
  @HttpCode(200)
  getHistory(@Param('historyId') historyId: string): Promise<HistoryGetResponseDto> {
    return this.historyService.getHistoryFromId(historyId);
  }
}
