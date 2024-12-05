import { LotusDto, LotusModel } from './model';
import { CodeFileDto, CodeFileModel } from '@/feature/codeView';
import { PageDto } from '@/feature/pagination';
import { UserDto, UserModel } from '@/feature/user/model';
import { api } from '@/shared/common/api';

interface LotusListDto {
  lotuses: (LotusDto & { author: UserDto })[];
  page: PageDto;
}

export interface LotusDetailModel {
  lotus: LotusModel;
  author: UserModel;
  language: string;
  files: CodeFileModel[];
}

export const getLotusList = async ({ page = 1, keyword }: { page?: number; keyword?: string }) => {
  const response = await api.get<LotusListDto>(
    `/api/lotus?page=${page}&size=${9}${keyword ? `&search=${keyword}` : ''}`
  );

  const lotuses = response.data.lotuses.map((lotus) => ({
    lotus: new LotusModel(lotus),
    author: new UserModel(lotus.author)
  }));

  return { lotuses, page: response.data.page };
};

type LotusDetailDto = LotusDto & { files: CodeFileDto[] } & { language: string } & { author: UserDto };

export const getLotusDetail = async ({ id }: { id: string }) => {
  const response = await api.get<LotusDetailDto>(`/api/lotus/${id}`);

  const data = response.data;

  const lotus = new LotusModel(data);
  const language = data.language;
  const files = data.files.map((file) => new CodeFileModel(file));
  const author = new UserModel(data.author);

  return {
    lotus,
    author,
    language,
    files
  };
};

export const deleteLotus = async ({ id }: { id: string }) => {
  const response = await api.delete<LotusDetailDto>(`/api/lotus/${id}`);

  const data = response.data;

  return data;
};

interface UpdateLotusDto {
  title?: string;
  tags?: string[];
  isPublic?: boolean;
}

export const updateLotus = async ({ id, body }: { id: string; body: UpdateLotusDto }) => {
  const response = await api.patch<LotusDetailDto>(`/api/lotus/${id}`, body);

  const data = response.data;

  return data;
};

interface CreateLotusDto {
  title: string;
  isPublic: boolean;
  tags: string[];
  gistUuid: string;
}

export const createLotus = async ({ body }: { body: CreateLotusDto }) => {
  const response = await api.post<LotusDetailDto>(`/api/lotus`, body);

  const data = response.data;

  return {
    lotus: new LotusModel(data),
    author: new UserModel(data.author)
  };
};
