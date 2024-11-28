import { HistoryDto, HistoryModel } from '.';
import { PageDto, PageModel } from '@/feature/pagination';
import { api } from '@/shared/common/api';

interface LotusHistoryListDto {
  list: HistoryDto[];
  page: PageDto;
}

export const getLotusHistoryList = async ({ id, page = 1 }: { id: string; page?: number }) => {
  const response = await api.get<LotusHistoryListDto>(`/api/lotus/${id}/history?page=${page}&size=${5}`);

  const list = response.data.list.map((history) => new HistoryModel(history));

  return {
    list,
    page: new PageModel(response.data.page)
  };
};

export const getLotusHistory = async ({ id, historyId }: { id: string; historyId: string }) => {
  const { data } = await api.get<HistoryDto>(`/api/lotus/${id}/history/${historyId}`);

  return new HistoryModel(data);
};

export interface PostCodeRunProps {
  lotusId: string;
  input: string[];
  execFileName: string;
}

export const postCodeRun = async ({ lotusId, input, execFileName }: PostCodeRunProps) => {
  const body = {
    input,
    execFileName
  };
  const response = await api.post(`/api/lotus/${lotusId}/history`, body);

  const data = response.data;

  return data;
};
