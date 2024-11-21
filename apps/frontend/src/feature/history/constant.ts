export const HISTORY_STATUS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PENDING: 'PENDING'
} as const;

export const HISTORY_STATUS_COLOR = {
  [HISTORY_STATUS.SUCCESS]: 'bg-green-500',
  [HISTORY_STATUS.ERROR]: 'bg-orange-500',
  [HISTORY_STATUS.PENDING]: 'bg-sky-500'
} as const;
