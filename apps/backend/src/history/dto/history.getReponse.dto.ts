import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { HISTORY_STATUS } from '@/constants/constants';
import { History } from '@/history/history.entity';

export class HistoryGetResponseDto {
  @IsEnum(HISTORY_STATUS)
  status: string;
  @IsString()
  filename: string;
  @IsArray()
  input: string[];
  @IsString()
  output: string;
  @IsDate()
  data: Date;

  static of(history: History): HistoryGetResponseDto {
    return {
      status: history.status,
      filename: history.execFilename,
      input: JSON.parse(history.input),
      output: history.result,
      data: history.createdAt
    };
  }
}
