import React, { useEffect, useRef, useState } from 'react';

import { PAGE_SIZE_OPTIONS } from './constants.ts';
import './style.css';

const makeTable = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  getRowProps,
  className = '',
}) => (
  <table className={className} {...getTableProps()}>
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th {...column.getHeaderProps()}>
              {column.render('Header')}
              <div>{column.canFilter ? column.render('Filter') : null}</div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps(getRowProps(row))}>
            {row.cells.map((cell) => (
              <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
);

const installInfiniteScroll = (load) => {
  const loader = useRef(null);
  const [hasMore, updateHasMore] = useState(true);
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      updateHasMore(load());
    }
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);
  return { loadingRef: loader, hasMore };
};

const makeInfiniteLoading = (load) => {
  const { loadingRef, hasMore } = installInfiniteScroll(load);
  return hasMore ? <div ref={loadingRef} className="loader" /> : '';
};

const makePagination = ({
  pageOptions,
  state: { pageIndex, pageSize },
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
  canPreviousPage,
  canNextPage,
}) => (
  <div>
    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
      Previous Page
    </button>
    <button onClick={() => nextPage()} disabled={!canNextPage}>
      Next Page
    </button>
    <div>
      Page
      <em>{` ${pageIndex + 1} of ${pageOptions.length}`}</em>
    </div>
    <div>Go to page:</div>
    <input
      type="number"
      defaultValue={pageIndex + 1 || 1}
      onChange={(e) => {
        const page = e.target.value ? Number(e.target.value) - 1 : 0;
        gotoPage(page);
      }}
    />
    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
    >
      {PAGE_SIZE_OPTIONS.map((size) => (
        <option key={size} value={size}>
          Show
          {size}
        </option>
      ))}
    </select>
  </div>
);

const TableBase = ({
  // Base table props
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  getRowProps = () => {},
  className,
  // Pagination props
  pageOptions,
  state: { pageIndex, pageSize },
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
  canPreviousPage,
  canNextPage,
  // App-base props
  options = {},
}) => {
  const Table = makeTable({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    getRowProps,
    className,
  });

  const { pagination, loadMore } = options;
  if (pagination && loadMore) {
    throw new Error(
      'You cannot have pagination and infinite loading in the same table!',
    );
  }
  const Footer = pagination
    ? makePagination({
        pageOptions,
        state: { pageIndex, pageSize },
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
      })
    : loadMore
    ? makeInfiniteLoading(loadMore)
    : '';

  return (
    <div className="table-container">
      {Table}
      {Footer}
    </div>
  );
};

export default TableBase;

