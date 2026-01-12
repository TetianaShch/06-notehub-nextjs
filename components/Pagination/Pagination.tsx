'use client';

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={event => onPageChange(event.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      previousLabel="←"
      nextLabel="→"
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      breakLabel="..."
    />
  );
}
