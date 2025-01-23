import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import { VirtualMoneyModal } from '@/components/modals/virtual-money-modal';
import { VirtualMoneyTableRow } from '@/components/pages/virtual-money/VirtualMoneyTableRow';
import Pagination from '@/components/table/pagination/Pagination';
import Table from '@/components/table/Table';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { routeConfig } from '@/config/routeConfig';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import {
  IVirtualMoneyResponse,
  Transaction,
} from '@/lib/validations/virtual-money';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import QueryString from 'qs';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

export default function PendingVirtualMoneyList() {
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleChangePage,
    handleSort,
    handleChangeRowsPerPage,
  } = useTable({});

  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'transactionId', label: 'TRANSACTION ID', align: 'left' },
    { id: 'amount', label: 'AMOUNT', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'remarks', label: 'REMARKS', align: 'left' },
    { id: 'createdAt', label: 'CREATED AT', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  const [selectedVirtualMoney, setSelectedVirtualMoney] =
    useState<Transaction | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'view';
  }>({ open: false, mode: 'view' });

  const initialFilterState = {
    search: '',
  };

  const { filterState, debouncedFilterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  const createQueryParams = useCallback(
    (filters: { search: string }) => ({
      ...(filters.search && { search: filters.search }),
      page: page - 1,
      size: rowsPerPage,
      status: 'PENDING',
    }),
    [page, rowsPerPage]
  );

  const { data, error, mutate, isLoading } = useSWR<
    IApiResponse<IVirtualMoneyResponse>
  >(
    BACKEND_ENDPOINTS.VIRTUAL_MONEY.LIST(
      QueryString.stringify(createQueryParams(debouncedFilterState))
    )
  );

  const virtualMoneyList = data?.data?.content || [];

  const handleModalOpen = (mode: 'view', virtualMoney: Transaction) => {
    setSelectedVirtualMoney(virtualMoney);
    setModalState({ open: true, mode });
  };

  const handleModalClose = () => {
    setModalState({ open: false, mode: 'view' });
    setSelectedVirtualMoney(null);
  };

  const onApprove = () => {
    mutate();
  };

  const isNotFound = !virtualMoneyList.length && !isLoading && !error;

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs icon={routeConfig.virtualMoneyPending.icon} />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search virtual money...'
              value={filterState.search}
              onChange={(e) =>
                handleFilterInputChange('search', e.target.value)
              }
              className='max-w-sm h-10 bg-gray-50'
            />
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={virtualMoneyList.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                virtualMoneyList.map((virtualMoney, index) => (
                  <VirtualMoneyTableRow
                    key={virtualMoney.id}
                    virtualMoney={virtualMoney}
                    index={(page - 1) * rowsPerPage + index + 1}
                    handleModalOpen={handleModalOpen}
                    onApprove={onApprove}
                  />
                ))}
              <TableEmptyRows
                emptyRows={
                  data
                    ? emptyRows(page, rowsPerPage, data?.data?.totalElements)
                    : 0
                }
              />
            </tbody>
          </Table>

          <TableNoData isNotFound={isNotFound} />
          <TableBodyLoading
            isLoading={isLoading}
            tableRowPerPage={rowsPerPage}
          />

          <Pagination
            totalRows={data?.data?.totalElements || 0}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>

      <VirtualMoneyModal
        open={modalState.open}
        onClose={handleModalClose}
        onSubmit={async () => {}}
        mode={modalState.mode}
        virtualMoney={selectedVirtualMoney || undefined}
        isSubmitting={false}
      />
    </div>
  );
}
