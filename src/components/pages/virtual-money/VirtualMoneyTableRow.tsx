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
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/validations/virtual-money';
import { Check, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface VirtualMoneyTableRowProps {
  virtualMoney: Transaction;
  index: number;
  handleModalOpen: (mode: 'view', virtualMoney: Transaction) => void;
  onApprove: (virtualMoney: Transaction) => Promise<void>;
}

export function VirtualMoneyTableRow({
  virtualMoney,
  index,
  handleModalOpen,
  onApprove,
}: VirtualMoneyTableRowProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await onApprove(virtualMoney);
      toast({
        title: 'Success',
        description: 'Virtual money approved successfully',
      });
      setApproveDialogOpen(false);
    } catch (error) {
      console.error('Error approving virtual money:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(virtualMoney.amount);

  return (
    <>
      <TableRow className='border-b hover:bg-gray-50/50'>
        <TableData className='pl-4 w-1/12'>{index + 1}</TableData>
        <TableData>{virtualMoney.transactionId}</TableData>
        <TableData>{formattedAmount}</TableData>
        <TableData>
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold text-white w-[90px] justify-center',
              {
                'bg-warning': virtualMoney.status === 'PENDING',
                'bg-success': virtualMoney.status === 'APPROVED',
                'bg-destructive': virtualMoney.status === 'REJECTED',
              }
            )}
          >
            {virtualMoney.status}
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
            {virtualMoney.status === 'PENDING' && (
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
            <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={isApproving}
              className='bg-success hover:bg-success/90'
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
