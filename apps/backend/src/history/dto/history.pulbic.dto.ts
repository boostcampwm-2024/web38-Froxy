import { History } from '@/history/history.entity';

export class HistoryPublicDto {
  id: string;
  status: string;
  filename: string;
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
