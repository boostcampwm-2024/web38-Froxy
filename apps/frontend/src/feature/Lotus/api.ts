import { LotusType } from './type';

import { CodeViewValue } from '@/feature/CodeView';

export const getLotusList = async ({ page = 1 }: { page: number }) => {
  const res = await fetch(`/api/lotus?page=${page}`);

  const { lotuses } = await res.json();

  return lotuses.map((lotus: LotusType) => ({
    ...lotus,
    date: new Date(lotus.date)
  })) as LotusType[];
};

export const getLotusDetail = async ({
  id
}: {
  id: string;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await fetch(`/api/lotus/${id}`);

  const data = await response.json();

  return { ...data, date: new Date(data.date) };
};
