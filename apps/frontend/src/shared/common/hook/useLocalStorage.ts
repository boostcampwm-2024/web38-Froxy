import { useEffect, useState } from 'react';

//TODO : 간단한 로컬스토리지 훅이니까 추후 수정이 필요할 수 있음
export const useLocalStorage = <T extends unknown>({ key, initialValue }: { key: string; initialValue: T }) => {
  const [storage, setStorage] = useState(() => {
    const item = window.localStorage.getItem(key) || '';

    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storage));
  }, [key, storage]);

  return [storage, setStorage];
};
