import { Injectable } from '@nestjs/common';
import { LotusRepository } from './lotus.repository';

@Injectable()
export class LotusService {
  constructor(private readonly lotusRepository: LotusRepository) {}
  getHello(): string {
    return 'Hello World!';
  }
}
