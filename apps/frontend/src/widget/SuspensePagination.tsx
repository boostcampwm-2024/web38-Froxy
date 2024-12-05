import { useSuspenseQuery } from '@tanstack/react-query';
import { Pagination } from '@/feature/pagination';

interface Page {
  max: number;
  current: number;
}

interface PaginationQueryOptions {
  queryKey: Record<string, any>[];
  queryFn: (...args: any[]) => Promise<{ page: Page }>;
}

interface SuspensePaginationProps {
  queryOptions: PaginationQueryOptions;
  onChangePage: (page: number) => void;
  activeScrollTop?: true;
}

export function SuspensePagination({ queryOptions, onChangePage, activeScrollTop }: SuspensePaginationProps) {
  const { data } = useSuspenseQuery(queryOptions);

  return (
    <Pagination
      totalPages={data?.page?.max ?? 1}
      initialPage={data?.page?.current ?? 1}
      onChangePage={onChangePage}
      activeScrollTop={activeScrollTop}
    />
  );
}

SuspensePagination.Skeleton = Pagination.Skeleton;
