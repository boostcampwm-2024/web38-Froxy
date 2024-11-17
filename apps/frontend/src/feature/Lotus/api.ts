import { LotusType } from './type';

export const getLotusList = async ({ page = 1 }: { page: number }) => {
  const res = await fetch(`/api/lotus?page=${page}`);

  const { lotuses } = await res.json();

  return lotuses.map((lotus: LotusType) => ({
    ...lotus,
    date: new Date(lotus.date)
  })) as LotusType[];
};
