import { useState } from 'react';

interface UsePaginationProps {
  totalPages: number;
  initialPage?: number;
  onChangePage?: (page: number) => void;
}

export function usePagination({ totalPages, initialPage = 1, onChangePage }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const onClickPage = (page: number) => {
    setCurrentPage(page);
    onChangePage?.(page);
  };

  const onClickPrevious = () => {
    if (currentPage > 1) onClickPage(currentPage - 1);
  };

  const onClickNext = () => {
    if (currentPage < totalPages) onClickPage(currentPage + 1);
  };

  const getPaginationItems = () => {
    const items: (number | 'ellipsis')[] = [];
    const showStartEllipsis = currentPage > 4;
    const showEndEllipsis = currentPage < totalPages - 3;

    items.push(1); // 항상 첫 페이지 표시

    // 현재 페이지가 첫 페이지로부터 4 이상 떨어져 있을 경우 시작 생략점 추가
    if (showStartEllipsis) {
      items.push('ellipsis');
    }

    // 현재 페이지 기준으로 앞뒤 1 페이지씩 추가
    const startPage = showStartEllipsis ? Math.max(2, currentPage - 1) : 2;
    const endPage = showEndEllipsis ? Math.min(totalPages - 1, currentPage + 1) : totalPages - 1;

    for (let page = startPage; page <= endPage; page++) {
      items.push(page);
    }

    // 현재 페이지가 마지막 페이지로부터 3 이상 떨어져 있을 경우 끝 생략점 추가
    if (showEndEllipsis) {
      items.push('ellipsis');
    }

    if (totalPages > 1) {
      items.push(totalPages); // 항상 마지막 페이지 표시
    }

    console.log('currentPage: ', currentPage);
    console.log('items:', items);
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
