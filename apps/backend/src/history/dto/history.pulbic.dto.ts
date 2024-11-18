import { History } from '@/history/history.entity';

export class HistoryPublicDto {
  historyId: string;
  status: string;
  date: Date;

  static of(history: History): HistoryPublicDto {
    console.log(history);
    return {
      historyId: history.historyId,
      status: history.status,
      date: history.createdAt
    };
  }
}
