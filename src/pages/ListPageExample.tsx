'use client';
import { fetcher } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Page from '@/components/HOC/page';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import OrderTableRow from '@/components/pages/order/OrderTableRow';
import OrderTableToolbar from '@/components/pages/order/OrderTableToolbar';
import Pagination from '@/components/table/pagination/Pagination';
import Table from '@/components/table/Table';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import { ITableHead } from '@/types/components/table';
import {
  IOrderApiQueryParams,
  IOrderFilter,
  IOrderResponse,
} from '@/types/features/order';
import QueryString from 'qs';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';

export default function Home() {
  // Custom hook managing table state and handlers
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleChangePage,
    handleSort,
    handleChangeRowsPerPage,
    handleSelectRow,
    handleSelectAllRows,
  } = useTable({ defaultOrderBy: 'date' });

  // Define table head columns with filtering options
  const TABLE_HEAD: ITableHead[] = [
    { id: '$oid', label: 'Order Id', filter: true },
    { id: 'date', label: 'Creating date', filter: true },
    { id: 'customer', label: 'Customer Info', filter: false },
    { id: 'grandTotal', label: 'Total', filter: true },
    { id: 'Quantity', label: 'Quantity', filter: false },
    { id: 'Payment', label: 'Payment status', filter: false },
    { id: 'Delivery', label: 'Delivery method', filter: false },
    { id: 'Status', label: 'Status', filter: true },
  ];

  // Initial state for filters
  const initialFilterState: IOrderFilter = {
    id: '',
    search: '',
  };

  // State and handlers for managing filters using a custom hook
  const {
    filterState,
    debouncedFilterState,
    handleFilterInputChange,
    handleFilterStateReset,
  } = useFilter(initialFilterState);

  // Create query params for the API using a custom hook
  const createQueryParams = useCallback(
    (filters: IOrderFilter): IOrderApiQueryParams => ({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      sort_by: orderBy,
      order,
      ...(filters.id && { id: filters.id }),
      ...(filters.search && { search: filters.search }),
    }),
    [page, rowsPerPage, orderBy, order]
  );

  // Fetch data using SWR with the generated query string
  const { isLoading, data, error } = useSWR<IOrderResponse>(
    BACKEND_ENDPOINTS.ORDER(
      QueryString.stringify(createQueryParams(debouncedFilterState))
    ),
    fetcher
  );

  // on filter state change restart pagination
  useEffect(() => {
    handleChangePage(1);
  }, [filterState]);

  // Check if no data is found
  const isNotFound = !data?.count && !isLoading && !error;

  return (
    <Page>
      <div>
        {/* Main Table Container */}
        <div className='bg-white rounded-xl border border-primaryBorder shadow-table'>
          {/* Order Table Toolbar */}
          <OrderTableToolbar
            data={data}
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterInputChange={handleFilterInputChange}
            setFilterState={handleFilterStateReset}
          />

          {/* Table and Table Headers */}
          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={data?.orders.length || 0}
              handleSort={handleSort}
              selectAllRow={(isAllSelected) => {
                if (data) {
                  handleSelectAllRows(
                    isAllSelected,
                    data.orders.map((order) => order._id.$oid)
                  );
                }
              }}
              headerData={TABLE_HEAD}
            />

            {/* Table Body and Rows */}
            <tbody className='divide-y divide-border-primaryBorder'>
              {!isLoading &&
                data?.orders.map((row) => (
                  <OrderTableRow
                    key={row._id.$oid}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectRow}
                  />
                ))}
              <TableEmptyRows
                emptyRows={data ? emptyRows(page, rowsPerPage, data.count) : 0}
              />
            </tbody>
          </Table>

          {/* Loading and No Data States */}
          <TableBodyLoading
            isLoading={isLoading}
            tableRowPerPage={rowsPerPage}
          />
          <TableNoData isNotFound={isNotFound} />
        </div>

        {/* Pagination Component */}
        <Pagination
          totalRows={data?.count || 0}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Page>
  );
}
