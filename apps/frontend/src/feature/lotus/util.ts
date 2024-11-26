import { AxiosError } from 'axios';

export const AxiosErrorToastData = {
  ['DEFAULT']: {
    description: '오류가 발생했습니다. 다시 시도해 주세요.',
    variant: 'error'
  },
  [400]: {
    description: '잘못된 요청입니다',
    variant: 'error'
  },
  [403]: {
    description: '권한이 없습니다.',
    variant: 'error'
  },
  [404]: {
    description: '존재하지 않는 Lotus입니다.',
    variant: 'error'
  },
  [409]: {
    title: '이미 생성된 Lotus가 존재합니다.',
    description: '중복된 Gist commit으로 생성할 수 없습니다.',
    variant: 'error'
  }
} as const;

export const getLotusMutationErrorToastData = (error?: unknown) => {
  const isAxiosError = error instanceof AxiosError;

  if (!isAxiosError) return AxiosErrorToastData['DEFAULT'];

  const inErrorToastData = error.status && error.status in AxiosErrorToastData;

  if (!inErrorToastData) return AxiosErrorToastData['DEFAULT'];

  const status = error.status || 'DEFAULT';

  return AxiosErrorToastData[status as keyof typeof AxiosErrorToastData];
};
