import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import TableBodyLoading from '@/components/loading/TableBodyLoading';
import SRTableRow from '@/components/pages/sr/SRTableRow';
import Table from '@/components/table/Table';
import TableEmptyRows from '@/components/table/TableEmptyRows';
import TableHeader from '@/components/table/TableHeader';
import TableNoData from '@/components/table/TableNoData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFilter } from '@/hooks/useFilter';
import useTable, { emptyRows } from '@/hooks/useTable';
import { ISRResponse, SR } from '@/lib/validations/sr';
import { routePaths } from '@/routes/routePaths';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

export default function SRManagement() {
  const navigate = useNavigate();
  const { page, rowsPerPage, order, orderBy, selected, handleSort } = useTable(
    {}
  );

  const TABLE_HEAD: ITableHead[] = [
    { id: 'sno', label: 'S.NO', align: 'left' },
    { id: 'firstName', label: 'FIRST NAME', align: 'left' },
    { id: 'lastName', label: 'LAST NAME', align: 'left' },
    { id: 'mobileNumber', label: 'PHONE NUMBER', align: 'left' },
    { id: 'emailAddress', label: 'EMAIL', align: 'left' },
    { id: 'level', label: 'LEVEL', align: 'left' },
    { id: 'distributorName', label: 'DISTRIBUTOR', align: 'left' },
    { id: 'subDistributorName', label: 'SUB DISTRIBUTOR', align: 'left' },
    { id: 'status', label: 'STATUS', align: 'left' },
    { id: 'actions', label: 'ACTIONS', align: 'right' },
  ];

  const initialFilterState = {
    search: '',
  };

  const { filterState, handleFilterInputChange } =
    useFilter(initialFilterState);

  const { data, error, mutate, isLoading } = useSWR<IApiResponse<ISRResponse>>(
    BACKEND_ENDPOINTS.SR.LIST('')
  );

  const srs = data?.data?.distributors || [];

  const filteredSRs = useMemo(() => {
    if (!filterState.search) return srs;

    return srs.filter((sr) => {
      const fullName = `${sr.firstName} ${sr.lastName}`.toLowerCase();
      const searchTerm = filterState.search.toLowerCase();
      return fullName.includes(searchTerm);
    });
  }, [srs, filterState.search]);

  const handleDelete = () => {
    mutate();
  };

  const isNotFound = !filteredSRs.length && !isLoading && !error;

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className=''>
        <Breadcrumbs />

        <Card className='p-6 space-y-4 bg-white shadow-sm'>
          <div className='flex justify-between items-center pb-2'>
            <Input
              placeholder='Search sales representatives...'
              value={filterState.search}
              onChange={(e) =>
                handleFilterInputChange('search', e.target.value)
              }
              className='max-w-sm h-10 bg-gray-50'
            />
            <Button
              onClick={() => navigate(routePaths.srAdd)}
              size='sm'
              className='px-4 h-10 text-white bg-rose-500 hover:bg-rose-600'
            >
              <Plus className='mr-2 w-4 h-4' />
              Add Sales Representative
            </Button>
          </div>

          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={filteredSRs.length || 0}
              handleSort={handleSort}
              headerData={TABLE_HEAD}
            />
            <tbody>
              {!isLoading &&
                filteredSRs.map((sr: SR, index: number) => (
                  <SRTableRow
                    key={sr.userId}
                    sr={sr}
                    index={(page - 1) * rowsPerPage + index + 1}
                    onDelete={handleDelete}
                  />
                ))}
              <TableEmptyRows
                emptyRows={
                  data ? emptyRows(page, rowsPerPage, filteredSRs.length) : 0
                }
              />
            </tbody>
          </Table>

          <TableNoData isNotFound={isNotFound} />
          <TableBodyLoading
            isLoading={isLoading}
            tableRowPerPage={rowsPerPage}
          />
        </Card>
      </div>
    </div>
  );
}
