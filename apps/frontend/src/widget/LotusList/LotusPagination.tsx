import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@froxy/design/components';
import { usePagination } from '@/feature/Pagination/usePagination';

interface LotusPaginationProps {
  totalPages: number;
  initialPage?: number;
  onChangePage?: (page: number) => void;
}

export function LotusPagination({ totalPages, initialPage = 1, onChangePage }: LotusPaginationProps) {
  const { currentPage, onClickPage, onClickPrevious, onClickNext, getPaginationItems } = usePagination({
    totalPages,
    initialPage,
    onChangePage
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onClickPrevious} />
        </PaginationItem>
        {getPaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {typeof item === 'number' ? (
              <PaginationLink onClick={() => onClickPage(item)} isActive={item === currentPage}>
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
    </Pagination>
  );
}
