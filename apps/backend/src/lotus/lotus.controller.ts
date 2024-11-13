import { Controller, Get } from '@nestjs/common';
import { LotusService } from './lotus.service';

@Controller()
export class LotusController {
  constructor(private readonly lotusService: LotusService) {}

  @Get()
  getHello(): string {
    return this.lotusService.getHello();
  }
}
