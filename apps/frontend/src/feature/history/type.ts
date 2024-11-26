import { HISTORY_STATUS } from './constant';

export type HistoryStatus = (typeof HISTORY_STATUS)[keyof typeof HISTORY_STATUS];
