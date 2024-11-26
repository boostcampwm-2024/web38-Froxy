import { useSuspenseQuery } from '@tanstack/react-query';
import { LotusLostQueryOptions } from './type';
import { Pagination } from '@/shared/pagination';

export function SuspenseLotusPagination({
  queryOptions,
  onChangePage
}: {
  queryOptions: LotusLostQueryOptions;
  onChangePage: (page: number) => void;
}) {
  const { data: lotusList } = useSuspenseQuery(queryOptions);

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={lotusList?.page?.current}
      onChangePage={onChangePage}
    />
  );
}

SuspenseLotusPagination.Skeleton = Pagination.Skeleton;
