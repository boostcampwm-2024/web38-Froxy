import { IsDate, IsEnum, IsIn, IsString } from 'class-validator';
import { HISTORY_STATUS } from '@/constants/constants';
import { History } from '@/history/history.entity';

export class HistoryPublicDto {
  @IsString()
  id: string;
  @IsEnum(HISTORY_STATUS)
  status: string;
  @IsString()
  filename: string;
  @IsDate()
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
