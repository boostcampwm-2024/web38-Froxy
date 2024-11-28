import {
  Pagination as PaginationBox,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@froxy/design/components';
import { Skeleton } from '@froxy/design/components';
import { usePagination } from '@/feature/pagination/usePagination';
import { range } from '@/shared/common';

interface PaginationProps {
  totalPages?: number;
  initialPage?: number;
  onChangePage?: (page: number) => void;
  activeScrollTop?: true;
}

export function Pagination({ totalPages = 1, initialPage = 1, onChangePage, activeScrollTop }: PaginationProps) {
  const { currentPage, onClickPage, onClickPrevious, onClickNext, getPaginationItems } = usePagination({
    totalPages,
    initialPage,
    onChangePage,
    activeScrollTop
  });

  return (
    <PaginationBox className="pt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onClickPrevious} />
        </PaginationItem>
        {getPaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {typeof item === 'number' ? (
              <PaginationLink onClick={() => item !== currentPage && onClickPage(item)} isActive={item === currentPage}>
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={onClickNext} />
        </PaginationItem>
      </PaginationContent>
    </PaginationBox>
  );
}

export function SkeletonPagination() {
  return (
    <div className="pt-12 flex justify-center items-center space-x-2">
      <Skeleton className="h-10 w-20 rounded-md" />
      {range(5).map((value) => (
        <Skeleton key={`page_${value}`} className="h-10 w-10 rounded-md" />
      ))}
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  );
}

Pagination.Skeleton = SkeletonPagination;
