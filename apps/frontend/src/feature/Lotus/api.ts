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

export const deleteLotus = async ({
  id
}: {
  id: string;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await fetch(`/api/lotus/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  return data;
};

interface UpdateLotusDto {
  title?: string;
  tags?: string[];
  isPublic?: boolean;
}

export const updateLotus = async ({
  id,
  body
}: {
  id: string;
  body: UpdateLotusDto;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await fetch(`/api/lotus/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return data;
};

interface CreateLotusDto {
  title: string;
  isPublic: boolean;
  tags: string[];
  gistUuid: string;
}

export const createLotus = async ({
  body
}: {
  body: CreateLotusDto;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await fetch(`/api/lotus`, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return data;
};
