import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HistoryExecRequestDto } from './dto/history.execRequest.dto';
import { HistoryGetResponseDto } from './dto/history.getReponse.dto';
import { HistoryResponseListDto } from './dto/history.responseList.dto';
import { HistoryService } from './history.service';

@Controller('lotus/:lotusId/history')
export class HistoryController {
  constructor(private historyService: HistoryService, private configService: ConfigService) {}

  @Post()
  @HttpCode(200)
  execCode(@Param('lotusId') lotusId: string, @Body() historyExecRequestDto: HistoryExecRequestDto): Promise<any> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
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
