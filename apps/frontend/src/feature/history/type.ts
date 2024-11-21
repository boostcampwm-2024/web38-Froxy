import { HISTORY_STATUS } from './constant';

export type HistoryStatus = (typeof HISTORY_STATUS)[keyof typeof HISTORY_STATUS];

export interface HistoryType {
  id: string;
  status: HistoryStatus;
  filename: string;
  input: string;
  output: string;
  date: Date;
}
