import { UserDto, UserModel } from './model';
import { CodeFileDto, CodeFileModel } from '@/feature/codeView';
import { LotusDto, LotusModel } from '@/feature/lotus';
import { PageDto } from '@/feature/pagination';
import { api } from '@/shared/common/api';

interface UserLotusListDto {
  lotuses: (LotusDto & { author: UserDto })[];
  page: PageDto;
}

// 사용자의 Lotus 목록 조회
export const getUserLotusList = async ({ page = 1, size = 6 }: { page?: number; size?: number }) => {
  const response = await api.get<UserLotusListDto>(`/api/user/lotus?page=${page}&size=${size}`);

  const lotuses = response.data.lotuses.map((lotus) => ({
    lotus: new LotusModel(lotus),
    author: new UserModel(lotus.author)
  }));

  return { lotuses, page: response.data.page };
};

interface GistType {
  gistId: string;
  title: string;
  nickname: string;
}

interface UserGistListDto {
  gists: GistType[];
  page: number;
  size: number;
  hasNextPage: boolean;
}

// 사용자의 Gist 목록 조회
export const getUserGistList = async ({ page = 1, size = 10 }: { page?: number; size?: number }) => {
  const response = await api.get<UserGistListDto>(`/api/user/gist?page=${page}&size=${size}`);

  const data = response.data;

  return data;
};

// TODO : Gist Feature 분리 고려
// 특정 gist의 파일 조회
interface GistFilesDto {
  files: CodeFileDto[];
}

export const getUserGistFile = async ({ gistId }: { gistId: string }) => {
  const response = await api.get<GistFilesDto>(`/api/user/gist/${gistId}`);

  const { files } = response.data;

  return files.map((file) => new CodeFileModel(file));
};

export const postLogin = async () => {
  const res = await api.post<{ token: string }>('/api/user/login');

  const data = res.data;

  return data;
};

//사용자 기본 정보 조회
export const getUserInfo = async () => {
  const res = await api.get<UserDto>('/api/user');

  return new UserModel(res.data);
};

interface UpdateUserDto {
  nickname: string;
}

// 사용자 정보 수정하기
export const patchUserInfo = async ({ body }: { body: UpdateUserDto }) => {
  const res = await api.patch('/api/user', body);

  return res.data;
};
