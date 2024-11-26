import { LotusModel } from '@/feature/lotus';
import { PageModel } from '@/feature/pagination';
import { UserModel } from '@/feature/user';

export type LotusLostQueryOptions = {
  queryKey: any[];
  queryFn: (arg: any) => Promise<{ lotuses: { lotus: LotusModel; author: UserModel }[]; page: PageModel }>;
};
