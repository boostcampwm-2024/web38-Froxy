import { IsNumber } from 'class-validator';

export class PageDto {
  @IsNumber()
  current: number;

  @IsNumber()
  max: number;

  static ofNumbers(current: number, max: number) {
    return { current, max };
  }
}
