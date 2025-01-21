import { fetcher } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SubDistributor } from '@/lib/validations/sub-distributor';
import { IApiResponse } from '@/types/common';
import { ITableHead } from '@/types/components/table';
import useSWR from 'swr';
import TableBodyLoading from '../loading/TableBodyLoading';
import Table from '../table/Table';
import TableData from '../table/TableData';
import TableHeader from '../table/TableHeader';
import TableNoData from '../table/TableNoData';
import TableRow from '../table/TableRow';

interface SRListModalProps {
  open: boolean;
  onClose: () => void;
  subDistributor: SubDistributor;
}

interface SR {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  status: boolean;
}

interface SRResponse {
  salesRepresentatives: SR[];
}

const TABLE_HEAD: ITableHead[] = [
  { id: 'firstName', label: 'FIRST NAME', align: 'left' },
  { id: 'lastName', label: 'LAST NAME', align: 'left' },
  { id: 'emailAddress', label: 'EMAIL', align: 'left' },
  { id: 'status', label: 'STATUS', align: 'left' },
];

export function SRListModal({
  open,
  onClose,
  subDistributor,
}: SRListModalProps) {
  const { data, error, isLoading } = useSWR<IApiResponse<SRResponse>>(
    open
      ? BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.SR_LIST(subDistributor.userId)
      : null,
    fetcher
  );

  const salesRepresentatives = data?.data?.salesRepresentatives || [];
  const isNotFound = !salesRepresentatives.length && !isLoading && !error;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[1000px] p-0'>
        <DialogHeader className='px-8 py-6 border-b'>
          <DialogTitle className='text-lg font-medium'>
            Sales Representatives of {subDistributor.firstName}{' '}
            {subDistributor.lastName}
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
                salesRepresentatives.map((sr) => (
                  <TableRow
                    key={sr.id}
                    className='border-b hover:bg-gray-50/50'
                  >
                    <TableData>{sr.firstName}</TableData>
                    <TableData>{sr.lastName}</TableData>
                    <TableData>{sr.emailAddress}</TableData>
                    <TableData>
                      <div
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
                          sr.status ? 'bg-success' : 'bg-destructive'
                        )}
                      >
                        {sr.status ? 'Active' : 'Inactive'}
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
