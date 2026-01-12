'use client';

import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className={css.pagination}>
      <button disabled={prevDisabled} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
