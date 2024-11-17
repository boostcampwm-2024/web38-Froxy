import { HistoryType } from '.';

export const getLotusHistoryList = async ({
  id
}: {
  id: string;
}): Promise<{ list: HistoryType[]; page: { current: number; max: number } }> => {
  const response = await fetch(`/api/lotus/${id}/history`);

  const data = (await response.json()) as { list: HistoryType[]; page: { current: number; max: number } };

  const body = { ...data, list: data.list.map(({ date, ...rest }) => ({ ...rest, date: new Date(date) })) };

  return body;
};
