import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { HISTORY_STATUS } from '@/constants/constants';
import { History } from '@/history/history.entity';

export class HistoryGetResponseDto {
  @IsEnum(HISTORY_STATUS)
  @ApiProperty({
    example: 'PENDING'
  })
  status: string;

  @IsString()
  @ApiProperty({
    example: 'FunctionDivide.js'
  })
  filename: string;

  @IsArray()
  @ApiProperty({
    example: '[1 1 1 1, 1 1 1 1, 1 1 1 1, 1 1 1 1]'
  })
  input: string[];

  @IsString()
  @ApiProperty({
    example: '실행결과'
  })
  output: string;

  @IsDate()
  @ApiProperty({
    example: '실행일시'
  })
  date: Date;

  static of(history: History): HistoryGetResponseDto {
    return {
      status: history.status,
      filename: history.execFilename,
      input: JSON.parse(history.input),
      output: history.result,
      date: history.createdAt
    };
  }
}
