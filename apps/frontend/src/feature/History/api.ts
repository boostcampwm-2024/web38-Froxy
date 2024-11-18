import { HistoryType } from '.';

export const getLotusHistoryList = async ({
  id
}: {
  id: string;
}): Promise<{ list: HistoryType[]; page: { current: number; max: number } }> => {
  const response = await fetch(`/api/lotus/${id}/history`);

  const data = (await response.json()) as { list: HistoryType[]; page: { current: number; max: number } };

  console.log(data);

  const body = {
    ...data,
    list: data.list.map(({ date, ...rest }) => ({ ...rest, date: new Date(date) }))
  };

  return body;
};

export const getLotusHistory = async ({ id, historyId }: { id: string; historyId: string }): Promise<HistoryType> => {
  const response = await fetch(`/api/lotus/${id}/history/${historyId}`);

  const data = (await response.json()) as HistoryType;

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
  const res = await fetch(`/api/lotus/${lotusId}/history`, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const data = await res.json();

  return data;
};
