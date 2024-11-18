import { UserType } from './type';
import { LotusType } from '@/feature/Lotus/type';

// github 사용자 기본 정보 조회
export const getUserInfo = async () => {
  const res = await fetch('/api/user');

  const user = await res.json();

  return user as UserType;
};

// 사용자의 Lotus 목록 조회
export const getUserLotusList = async ({ page, size }: { page: number; size: number }) => {
  const res = await fetch(`/api/user/lotus?page=${page}&size=${size}`);

  const { lotuses } = await res.json();

  return lotuses.map((lotus: LotusType) => ({
    ...lotus,
    date: new Date(lotus.date)
  })) as LotusType[];
};
