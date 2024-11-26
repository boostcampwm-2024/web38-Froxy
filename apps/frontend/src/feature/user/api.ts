import { UserType } from './type';
import { LotusType } from '@/feature/lotus/type';
import { api } from '@/shared/common/api';
import { PageType } from '@/shared/pagination';

// 사용자의 Lotus 목록 조회
export const getUserLotusList = async ({ page = 1, size = 6 }: { page?: number; size?: number }) => {
  const response = await api.get(`/api/user/lotus?page=${page}&size=${size}`);

  const lotuses: LotusType[] = response.data.lotuses.map((lotus: LotusType) => ({
    ...lotus,
    date: new Date(lotus.date)
  }));

  return { lotuses, page: response.data.page as PageType };
};

interface GistType {
  gistId: string;
  title: string;
  nickname: string;
}

interface UserGistListResponse {
  gists: GistType[];
  page: number;
  size: number;
  hasNextPage: boolean;
}

// 사용자의 Gist 목록 조회
export const getUserGistList = async ({ page = 1, size = 10 }: { page?: number; size?: number }) => {
  const response = await api.get(`/api/user/gist?page=${page}&size=${size}`);

  const data = response.data;

  return data as UserGistListResponse;
};

// TODO : Gist Feature 분리 고려
// 특정 gist의 파일 조회
interface GistFileType {
  filename: string;
  language: string;
  content: string;
}

export const getUserGistFile = async ({ gistId }: { gistId: string }) => {
  const response = await api.get(`/api/user/gist/${gistId}`);

  const { files } = await response.data;

  return files as GistFileType[];
};

export const postLogin = async () => {
  const res = await api.post<{ token: string }>('/api/user/login');

  const data = res.data;

  return data;
};

//사용자 기본 정보 조회
export const getUserInfo = async () => {
  const res = await api.get<UserType>('/api/user');

  return res.data;
};

interface PatchUserInfo {
  nickname: string;
}

// 사용자 정보 수정하기
export const patchUserInfo = async ({ body }: { body: PatchUserInfo }) => {
  const res = await api.patch('/api/user', body);

  return res.data;
};
