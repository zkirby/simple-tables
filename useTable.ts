import { compact, some } from 'lodash';
import { useMemo } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';
import filterTypes, { defaultColumn } from './filters';

const makeTableProps = (tableProps, options) => {
  // When pagination is enabled, tableProps provides
  // a page object as the rows, we remap it here to keep
  // the interface consistent
  if (options?.pagination) {
    return { ...tableProps, rows: tableProps.page, options };
  }
  return { ...tableProps, options };
};

export default function useTableWrapper(
  {
    columns,
    rows,
  }: {
    columns: Array<{
      Header: string;
      accessor: string;
      filter?: string;
      Filter?: any;
      Cell?: ({ row: Object }) => any;
    }>;
    rows: Array<Record<string, any>>;
  },
  options?: Partial<{ pagination: boolean; loadMore: () => void }>,
): Record<string, any> {
  const tableOptions = compact([
    some(columns, (col) => col.filter || col.Filter) && useFilters,
    options?.pagination && usePagination,
  ]);
  const tableProps = useTable(
    {
      columns: useMemo(() => columns, []),
      data: useMemo(() => rows, [rows]),
      filterTypes: useMemo(() => filterTypes, []),
      defaultColumn: useMemo(() => defaultColumn, []),
    },
    ...tableOptions,
  );
  return makeTableProps(tableProps, options);
}

