import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import TableData from '@/components/table/TableData';
import TableRow from '@/components/table/TableRow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { cn, formatAmount } from '@/lib/utils';
import { Transaction } from '@/lib/validations/virtual-money';
import { Check, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface VirtualMoneyTableRowProps {
  virtualMoney: Transaction;
  index: number;
  handleModalOpen: (mode: 'view', virtualMoney: Transaction) => void;
  onApprove: () => void;
}

export function VirtualMoneyTableRow({
  virtualMoney,
  index,
  handleModalOpen,
  onApprove,
}: VirtualMoneyTableRowProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.VIRTUAL_MONEY.APPROVE,
    sendPostRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Virtual money approved successfully',
        });
        setApproveDialogOpen(false);
        onApprove();
      },
    }
  );

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData>{virtualMoney.transactionId}</TableData>
        <TableData>{formatAmount(virtualMoney.amount)}</TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              {
                'bg-yellow-500': virtualMoney.status.name === 'PENDING',
                'bg-success': virtualMoney.status.name === 'APPROVED',
                'bg-destructive': virtualMoney.status.name === 'REJECTED',
              }
            )}
          >
            {virtualMoney.status.name}
          </div>
        </TableData>
        <TableData className='max-w-[250px] truncate'>
          {virtualMoney.remarks}
        </TableData>
        <TableData>
          {new Date(virtualMoney.createdAt).toLocaleString()}
        </TableData>
        <TableData className='pr-1 text-right'>
          <div className='flex gap-2 justify-end items-center'>
            {virtualMoney.status.name === 'PENDING' && (
              <Button
                size='sm'
                className='bg-green-500 hover:bg-green-600 border-green-600 text-white'
                onClick={() => setApproveDialogOpen(true)}
              >
                <Check className='w-4 h-4 text-white' />
                Approve
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-8 h-8 hover:bg-gray-100'>
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='w-4 h-4 text-gray-500' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem
                  onClick={() => handleModalOpen('view', virtualMoney)}
                  className='text-sm'
                >
                  <Eye className='mr-2 w-4 h-4 text-primary' />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableData>
      </TableRow>

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Virtual Money</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this virtual money request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                trigger({
                  id: virtualMoney.id,
                  status: 'APPROVED',
                })
              }
              disabled={isMutating}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
