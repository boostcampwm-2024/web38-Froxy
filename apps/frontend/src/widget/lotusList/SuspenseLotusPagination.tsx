import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LotusLostQueryOptions } from './type';
import { Pagination } from '@/shared/pagination';

export function SuspenseLotusPagination({ queryOptions }: { queryOptions: LotusLostQueryOptions }) {
  const { data: lotusList } = useSuspenseQuery(queryOptions);
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={lotusList?.page?.current}
      onChangePage={(page) => navigate({ to: '/lotus', search: { page } })}
    />
  );
}

SuspenseLotusPagination.Skeleton = Pagination.Skeleton;
