import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PageDto {
  @IsNumber()
  @ApiProperty({
    example: 1
  })
  current: number;

  @IsNumber()
  @ApiProperty({
    example: 5
  })
  max: number;

  static ofNumbers(current: number, max: number) {
    return { current, max };
  }
}
