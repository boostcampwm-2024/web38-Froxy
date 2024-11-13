import { Injectable } from '@nestjs/common';
import { HistoryRepository } from './history.repository';

@Injectable()
export class HistoryService {
  constructor(private readonly HistoryRepository: HistoryRepository) {}
  getHello(): string {
    return 'Hello World!';
  }
}
