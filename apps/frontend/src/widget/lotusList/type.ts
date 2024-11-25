import { LotusType } from '@/feature/lotus';

export type LotusLostQueryOptions = {
  queryKey: any[];
  queryFn: (arg: any) => Promise<{ lotuses: LotusType[]; page: { max: number; current: number } }>;
};
