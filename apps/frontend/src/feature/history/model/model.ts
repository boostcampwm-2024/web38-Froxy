import { HISTORY_STATUS } from '@/feature/history/constant';
import { HistoryStatus } from '@/feature/history/type';

export interface HistoryDto {
  id: string;
  status: string;
  date: string;
  input: string;
  output: string;
  filename: string;
}

export class HistoryModel {
  public id: string;
  public status: HistoryStatus;
  public date: Date;
  public input: string;
  public output: string;
  public filename: string;

  constructor(dto: HistoryDto) {
    this.id = dto.id;
    this.status = HistoryModel.isValidState(dto.status) ? dto.status : HISTORY_STATUS.ERROR;
    this.date = new Date(dto.date);
    this.input = dto.input;
    this.output = dto.output;
    this.filename = dto.filename;
  }

  static isValidState(status: string): status is HistoryStatus {
    return Object.values(HISTORY_STATUS).includes(status as HistoryStatus);
  }

  static getPendingHistoriesId(histories: HistoryModel[]) {
    return histories.filter((history) => history.isStatus(HISTORY_STATUS.PENDING)).map((history) => history.id);
  }

  isStatus(status: HistoryStatus) {
    return this.status === status;
  }
}
