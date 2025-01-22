import BACKEND_ENDPOINTS from '@/api/urls';
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
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { SelectField } from '@/components/ui/form/select-field';
import {
  ICheckerResponse,
  IDistributorResponse,
  ISubDistributorPayload,
  SubDistributor,
  SubDistributorFormValues,
  subDistributorFormSchema,
} from '@/lib/validations/sub-distributor';
import { IApiResponse } from '@/types/common';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface SubDistributorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ISubDistributorPayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  subDistributor?: SubDistributor;
  isSubmitting: boolean;
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  subDistributor?: SubDistributor
): SubDistributorFormValues => {
  if (mode === 'add') {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      distributorId: '',
      status: 'active',
      checkerId: null,
    };
  }

  return {
    firstName: subDistributor?.firstName || '',
    lastName: subDistributor?.lastName || '',
    email: subDistributor?.emailAddress || '',
    phoneNumber: subDistributor?.mobileNumber || '',
    distributorId: subDistributor?.distributorId || '',
    status: subDistributor?.status ? 'active' : 'inactive',
    checkerId: subDistributor?.checkerId || null,
  };
};

export function SubDistributorModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  subDistributor,
  isSubmitting,
}: SubDistributorModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add Sub Distributor',
    edit: 'Edit Sub Distributor',
    view: 'View Sub Distributor',
  }[mode];

  const form = useForm<SubDistributorFormValues>({
    resolver: zodResolver(subDistributorFormSchema),
    defaultValues: getInitialValues(mode, subDistributor),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, subDistributor));
    }
  }, [open, mode, subDistributor, form]);

  // Fetch distributors and checkers
  const { data: distributorsData } = useSWR<IApiResponse<IDistributorResponse>>(
    open ? BACKEND_ENDPOINTS.DISTRIBUTOR.LIST('') : null
  );

  const { data: checkersData } = useSWR<IApiResponse<ICheckerResponse>>(
    open && form.watch('status') === 'inactive'
      ? BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.CHECKERS
      : null
  );

  const distributors = distributorsData?.data?.distributors || [];
  const checkers = checkersData?.data?.checkerList || [];

  const handleSubmit = async (values: SubDistributorFormValues) => {
    if (isViewMode) return;

    try {
      const payload: ISubDistributorPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          distributorId: values.distributorId,
          status: values.status === 'active',
          checkerId: values.status === 'active' ? null : values.checkerId,
        },
      };

      await onSubmit(payload);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting sub distributor:', error);
    }
  };

  // Don't render if sub distributor is not loaded in view mode
  if (mode === 'view' && !subDistributor) return null;

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
              <div className='grid grid-cols-2 gap-8'>
                <InputField
                  name='firstName'
                  form={form}
                  label='First Name'
                  required
                  disabled={isViewMode}
                />

                <InputField
                  name='lastName'
                  form={form}
                  label='Last Name'
                  required
                  disabled={isViewMode}
                />
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <InputField
                  name='email'
                  form={form}
                  label='Email'
                  type='email'
                  required
                  disabled={isViewMode}
                />

                <InputField
                  name='phoneNumber'
                  form={form}
                  label='Phone Number'
                  required
                  disabled={isViewMode}
                />
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <SelectField
                  name='distributorId'
                  form={form}
                  label='Distributor'
                  options={distributors.map((distributor) => ({
                    label: `${distributor.firstName} ${distributor.lastName}`,
                    value: distributor.userId,
                  }))}
                  required
                  disabled={isViewMode}
                />

                <RadioGroupField
                  name='status'
                  form={form}
                  label='Status'
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive', color: 'error' },
                  ]}
                  required
                  disabled={isViewMode}
                />
              </div>

              {form.watch('status') === 'inactive' && (
                <div className='grid grid-cols-2 gap-8'>
                  <SelectField
                    name='checkerId'
                    form={form}
                    label='Checker'
                    options={checkers.map((checker) => ({
                      label: checker.name,
                      value: checker.userId,
                    }))}
                    required
                    disabled={isViewMode}
                  />
                </div>
              )}
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
                    {mode === 'add' ? 'Create' : 'Update'}
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
