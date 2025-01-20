import { virtualMoneyApi } from '@/api/virtual-money';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/ui/form/input-field';
import { ServerSelectField } from '@/components/ui/form/server-select-field';
import { getMetaInfo } from '@/getMetaInfo';
import {
  IVirtualMoneyPayload,
  Transaction,
  VirtualMoneyFormValues,
  virtualMoneyFormSchema,
} from '@/lib/validations/virtual-money';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface VirtualMoneyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IVirtualMoneyPayload) => Promise<void>;
  mode: 'add' | 'view';
  virtualMoney?: Transaction;
  isSubmitting: boolean;
}

const getInitialValues = (
  mode: 'add' | 'view',
  virtualMoney?: Transaction
): VirtualMoneyFormValues => {
  if (mode === 'add') {
    return {
      amount: '',
      remarks: '',
      approverUserCode: '',
    };
  }

  return {
    amount: virtualMoney?.amount?.toString() || '',
    remarks: virtualMoney?.remarks || '',
    approverUserCode: virtualMoney?.approverUserCode || '',
  };
};

export function VirtualMoneyModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  virtualMoney,
  isSubmitting,
}: VirtualMoneyModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Generate Virtual Money',
    view: 'View Virtual Money',
  }[mode];

  const form = useForm<VirtualMoneyFormValues>({
    resolver: zodResolver(virtualMoneyFormSchema),
    defaultValues: getInitialValues(mode, virtualMoney),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, virtualMoney));
    }
  }, [open, mode, virtualMoney, form]);

  const loadApprovers = async ({ search }: { search: string }) => {
    try {
      const response = await virtualMoneyApi.getApproverList();
      return response.data.approverList
        .filter((approver) =>
          approver.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((approver) => ({
          label: approver.name,
          value: approver.userCode,
        }));
    } catch (error) {
      console.error('Error loading approvers:', error);
      return [];
    }
  };

  const handleSubmit = async (values: VirtualMoneyFormValues) => {
    if (isViewMode) return;

    try {
      const payload: IVirtualMoneyPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          amount: parseFloat(values.amount),
          approverUserCode: values.approverUserCode,
          remarks: values.remarks.trim(),
        },
      };

      await onSubmit(payload);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting virtual money:', error);
    }
  };

  // Don't render if virtualMoney is not loaded in view mode
  if (mode === 'view' && !virtualMoney) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[600px] p-0'>
        <DialogHeader className='px-8 py-6 border-b'>
          <DialogTitle className='text-lg font-medium'>
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='px-8 py-4 pb-8 space-y-6'>
              <InputField
                name='amount'
                form={form}
                label='Amount'
                type='number'
                required
                disabled={isViewMode}
              />

              <InputField
                name='remarks'
                form={form}
                label='Remarks'
                multiline
                rows={3}
                required
                disabled={isViewMode}
              />

              <ServerSelectField
                name='approverUserCode'
                form={form}
                label='Approver'
                loadOptions={loadApprovers}
                required
                disabled={isViewMode}
                placeholder='Select approver'
                isClearable={false}
              />
            </div>

            <DialogFooter className='gap-2 px-8 py-6 border-t'>
              {isViewMode ? (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='min-w-[120px] min-h-[36px]'
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button type='button' variant='outline' onClick={onClose}>
                    Clear
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    className='min-w-[120px] min-h-[36px] bg-primary hover:bg-primary/90'
                  >
                    Generate
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
