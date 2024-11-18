import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsIn, IsString } from 'class-validator';
import { HISTORY_STATUS } from '@/constants/constants';
import { History } from '@/history/history.entity';

export class HistoryPublicDto {
  @IsString()
  @ApiProperty({
    example: 'historyId'
  })
  id: string;

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

  @IsDate()
  @ApiProperty({
    example: '실행시간'
  })
  date: Date;

  static of(history: History): HistoryPublicDto {
    console.log(history);
    return {
      id: history.historyId,
      status: history.status,
      filename: history.execFilename,
      date: history.createdAt
    };
  }
}
