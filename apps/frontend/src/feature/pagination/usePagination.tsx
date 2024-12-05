import { useState } from 'react';

interface UsePaginationProps {
  totalPages: number;
  initialPage?: number;
  onChangePage?: (page: number) => void;
  activeScrollTop?: true;
}

export function usePagination({ totalPages, initialPage = 1, onChangePage, activeScrollTop }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const onClickPage = (page: number) => {
    setCurrentPage(page);
    onChangePage?.(page);

    if (activeScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onClickPrevious = () => {
    if (currentPage > 1) onClickPage(currentPage - 1);
  };

  const onClickNext = () => {
    if (currentPage < totalPages) onClickPage(currentPage + 1);
  };

  // "첫 페이지 ... 현재 페이지와 앞뒤 1페이지 ... 마지막 페이지 "로 구성되도록 구현함
  const getPaginationItems = () => {
    const items: (number | 'ellipsis')[] = [];
    const showStartEllipsis = currentPage > 4;
    const showEndEllipsis = currentPage < totalPages - 3;

    items.push(1);

    if (showStartEllipsis) items.push('ellipsis');

    const startPage = showStartEllipsis ? Math.max(2, currentPage - 1) : 2;
    const endPage = showEndEllipsis ? Math.min(totalPages - 1, currentPage + 1) : totalPages - 1;

    for (let page = startPage; page <= endPage; page++) {
      items.push(page);
    }

    if (showEndEllipsis) items.push('ellipsis');

    if (totalPages > 1) items.push(totalPages);

    return items;
  };

  return {
    currentPage,
    onClickPage,
    onClickPrevious,
    onClickNext,
    getPaginationItems
  };
}
