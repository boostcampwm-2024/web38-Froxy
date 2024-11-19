import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { HISTORY_STATUS } from '@/constants/constants';

export class HistoryExecResponseDto {
  @IsEnum(HISTORY_STATUS)
  @ApiProperty({
    example: 'PENDING'
  })
  status: string;

  static of(status: HISTORY_STATUS): HistoryExecResponseDto {
    return {
      status
    };
  }
}
