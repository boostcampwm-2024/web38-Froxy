import { useNavigate } from '@tanstack/react-router';
import { useUserLotusListSuspenseQuery } from '@/feature/user';
import { Pagination } from '@/shared/pagination';

export function SuspenseUserLotusPagination({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useUserLotusListSuspenseQuery({ page });
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}
