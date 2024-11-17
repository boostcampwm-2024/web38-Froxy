import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateLotusDto } from './dto/create.lotus.dto';
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
  ): Promise<CreateLotusDto> {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.lotusService.createLotus(gitToken, title, isPublic, tag, gistUuid);
  }
}
