import { fetcher } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Distributor } from '@/lib/validations/distributor';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import useSWR from 'swr';
import TableBodyLoading from '../loading/TableBodyLoading';
import Table from '../table/Table';
import TableData from '../table/TableData';
import TableHeader from '../table/TableHeader';
import TableNoData from '../table/TableNoData';
import TableRow from '../table/TableRow';

interface SubDistributorListModalProps {
  open: boolean;
  onClose: () => void;
  distributor: Distributor;
}

interface SubDistributor {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  status: boolean;
}

interface SubDistributorResponse {
  subDistributors: SubDistributor[];
}

const TABLE_HEAD: ITableHead[] = [
  { id: 'firstName', label: 'FIRST NAME', align: 'left' },
  { id: 'lastName', label: 'LAST NAME', align: 'left' },
  { id: 'emailAddress', label: 'EMAIL', align: 'left' },
  { id: 'status', label: 'STATUS', align: 'left' },
];

export function SubDistributorListModal({
  open,
  onClose,
  distributor,
}: SubDistributorListModalProps) {
  const { data, error, isLoading } = useSWR<
    IApiResponse<SubDistributorResponse>
  >(
    open
      ? BACKEND_ENDPOINTS.DISTRIBUTOR.SUB_DISTRIBUTORS(distributor.userId)
      : null,
    fetcher
  );

  const subDistributors = data?.data?.subDistributors || [];
  const isNotFound = !subDistributors.length && !isLoading && !error;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[1000px] p-0'>
        <DialogHeader className='px-8 py-6 border-b'>
          <DialogTitle className='text-lg font-medium'>
            Sub Distributors of {distributor.firstName} {distributor.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className='p-6'>
          <Table>
            <TableHeader
              headerData={TABLE_HEAD}
              order='asc'
              orderBy=''
              handleSort={() => {}}
            />
            <tbody>
              {!isLoading &&
                subDistributors.map((subDistributor) => (
                  <TableRow
                    key={subDistributor.id}
                    className='border-b hover:bg-gray-50/50'
                  >
                    <TableData>{subDistributor.firstName}</TableData>
                    <TableData>{subDistributor.lastName}</TableData>
                    <TableData>{subDistributor.emailAddress}</TableData>
                    <TableData>
                      <div
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
                          subDistributor.status
                            ? 'bg-success'
                            : 'bg-destructive'
                        )}
                      >
                        {subDistributor.status ? 'Active' : 'Inactive'}
                      </div>
                    </TableData>
                  </TableRow>
                ))}
            </tbody>
          </Table>

          <TableNoData isNotFound={isNotFound} />
          <TableBodyLoading isLoading={isLoading} tableRowPerPage={5} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
