import { LotusType } from './type';
import { CodeViewValue } from '@/feature/codeView';
import { api } from '@/shared/common/api';
import { PageType } from '@/shared/pagination';

export const getLotusList = async ({ page = 1 }: { page?: number }) => {
  const response = await api.get(`/api/lotus?page=${page}`);

  const lotuses: LotusType[] = response.data.lotuses.map((lotus: LotusType) => ({
    ...lotus,
    date: new Date(lotus.date)
  }));

  return { lotuses, page: response.data.page as PageType };
};

export const getLotusDetail = async ({
  id
}: {
  id: string;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await api.get(`/api/lotus/${id}`);

  const data = await response.data;

  return { ...data, date: new Date(data.date) };
};

export const deleteLotus = async ({
  id
}: {
  id: string;
}): Promise<LotusType & { language: string; files: CodeViewValue[] }> => {
  const response = await api.delete(`/api/lotus/${id}`);

  const data = response.data;

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
  const response = await api.patch(`/api/lotus/${id}`, body);

  const data = await response.data;

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
  const response = await api.post(`/api/lotus`, body);

  const data = await response.data;

  return data;
};
