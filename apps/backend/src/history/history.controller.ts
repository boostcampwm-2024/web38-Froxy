import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HistoryExecRequestDto } from './dto/history.execRequest.dto';
import { HistoryService } from './history.service';

@Controller('lotus/:lotusId/history')
export class HistoryController {
  constructor(private historyService: HistoryService, private configService: ConfigService) {}

  @Post()
  @HttpCode(200)
  execCode(
    @Param('lotusId') lotusId: string,
    @Body() historyExecRequestDto: HistoryExecRequestDto
  ): Promise<{ status }> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    // const execFileName = 'FunctionDivide.js';
    // const input = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    const { input, execFileName } = historyExecRequestDto;
    return this.historyService.saveHistory(gitToken, lotusId, execFileName, input);
  }
}
