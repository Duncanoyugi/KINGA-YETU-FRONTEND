export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  className?: string;
}

export interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export interface PaginationRange {
  start: number;
  end: number;
  pages: (number | 'ellipsis')[];
}