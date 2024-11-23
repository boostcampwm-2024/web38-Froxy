import { useNavigate } from '@tanstack/react-router';
import { useLotusListSuspenseQuery } from '@/feature/lotus';
import { Pagination } from '@/shared/pagination';

export function SuspenseLotusPagination({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useLotusListSuspenseQuery({ page });
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/lotus', search: { page } })}
    />
  );
}

SuspenseLotusPagination.Skeleton = Pagination.Skeleton;
