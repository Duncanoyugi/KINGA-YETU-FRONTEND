import { useMemo } from 'react';
import type { UsePaginationProps, PaginationRange } from './Pagination.types';

export const usePagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: UsePaginationProps): PaginationRange => {
  return useMemo(() => {
    // Total page numbers to show = siblings + current + 2 (first/last) + 2 ellipsis
    const totalPageNumbers = siblingCount * 2 + 5;

    // Case 1: If total pages is less than total numbers to show, show all pages
    if (totalPageNumbers >= totalPages) {
      const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);
      return {
        start: 1,
        end: totalPages,
        pages,
      };
    }

    // Calculate left and right sibling indices
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Whether to show ellipsis
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: Show left ellipsis, no right ellipsis
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightRange: number[] = [];
      for (let i = rightSiblingIndex; i <= totalPages; i++) {
        rightRange.push(i);
      }
      const pages: (number | 'ellipsis')[] = [firstPageIndex, 'ellipsis', ...rightRange];
      return {
        start: rightSiblingIndex,
        end: totalPages,
        pages,
      };
    }

    // Case 3: Show right ellipsis, no left ellipsis
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftRange: number[] = [];
      for (let i = 1; i <= leftSiblingIndex; i++) {
        leftRange.push(i);
      }
      const pages: (number | 'ellipsis')[] = [...leftRange, 'ellipsis', lastPageIndex];
      return {
        start: 1,
        end: leftSiblingIndex,
        pages,
      };
    }

    // Case 4: Show both ellipsis
    const middleRange: number[] = [];
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      middleRange.push(i);
    }
    const pages: (number | 'ellipsis')[] = [
      firstPageIndex,
      'ellipsis',
      ...middleRange,
      'ellipsis',
      lastPageIndex,
    ];
    return {
      start: leftSiblingIndex,
      end: rightSiblingIndex,
      pages,
    };
  }, [currentPage, totalPages, siblingCount]);
};
