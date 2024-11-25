import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { userQueryOptions } from '@/feature/user';
import { Pagination } from '@/shared/pagination';

export function SuspenseUserLotusPagination({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useSuspenseQuery(userQueryOptions.lotusList({ page }));
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}

SuspenseUserLotusPagination.Skeleton = Pagination.Skeleton;
