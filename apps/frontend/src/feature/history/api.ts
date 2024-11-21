import { HistoryType } from '.';
import { api } from '@/shared/common/api';

export const getLotusHistoryList = async ({
  id
}: {
  id: string;
}): Promise<{ list: HistoryType[]; page: { current: number; max: number } }> => {
  const response = await api.get(`/api/lotus/${id}/history`);

  const data = response.data as { list: HistoryType[]; page: { current: number; max: number } };

  console.log(data);

  const body = {
    ...data,
    list: data.list.map(({ date, ...rest }) => ({ ...rest, date: new Date(date) }))
  };

  return body;
};

export const getLotusHistory = async ({ id, historyId }: { id: string; historyId: string }): Promise<HistoryType> => {
  const response = await api.get(`/api/lotus/${id}/history/${historyId}`);

  const data = response.data as HistoryType;

  return data;
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
