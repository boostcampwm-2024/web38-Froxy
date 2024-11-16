import { History } from '@/history/history.entity';

export class HistoryGetResponseDto {
  status: string;
  input: string[];
  output: string;

  static of(history: History): HistoryGetResponseDto {
    console.log(history);
    return {
      status: history.status,
      input: JSON.parse(history.input),
      output: history.result
    };
  }
}
