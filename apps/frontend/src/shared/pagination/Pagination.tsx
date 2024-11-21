import {
  Pagination as PaginationBox,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@froxy/design/components';
import { usePagination } from '@/shared/pagination/usePagination';

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onChangePage?: (page: number) => void;
}

export function Pagination({ totalPages, initialPage = 1, onChangePage }: PaginationProps) {
  const { currentPage, onClickPage, onClickPrevious, onClickNext, getPaginationItems } = usePagination({
    totalPages,
    initialPage,
    onChangePage
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
