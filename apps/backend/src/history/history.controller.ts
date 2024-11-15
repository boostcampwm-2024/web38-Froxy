import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HistoryService } from './history.service';

@Controller('lotus/:lotusId/history')
export class HistoryController {
  constructor(private historyService: HistoryService, private configService: ConfigService) {}

  @Post()
  execCode(@Param('lotusId') lotusId: string): Promise<string> {
    //todo: parameter
    const execFilename = 'FunctionDivide.js';
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    const inputs = ['1 1 1 1', '1 1 1 1', '1 1 1 1', '1 1 1 1'];
    console.log(lotusId);
    return this.historyService.saveHistory(gitToken, lotusId, execFilename, inputs);
  }
}
