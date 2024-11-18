import { History } from '@/history/history.entity';

export class HistoryGetResponseDto {
  status: string;
  filename: string;
  input: string[];
  output: string;
  data: Date;

  static of(history: History): HistoryGetResponseDto {
    console.log(history);
    return {
      status: history.status,
      filename: history.execFilename,
      input: JSON.parse(history.input),
      output: history.result,
      data: history.createdAt
    };
  }
}
