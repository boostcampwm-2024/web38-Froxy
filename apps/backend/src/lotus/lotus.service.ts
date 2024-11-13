import { Injectable } from '@nestjs/common';

@Injectable()
export class LotusService {
  getHello(): string {
    return 'Hello World!';
  }
}
