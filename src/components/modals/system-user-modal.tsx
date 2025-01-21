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
import { SelectField } from '@/components/ui/form/select-field';
import { IRoleResponse } from '@/lib/validations/role';
import {
  ICheckerResponse,
  ISystemUserPayload,
  SystemUser,
  SystemUserFormValues,
  systemUserFormSchema,
} from '@/lib/validations/system-user';
import { IApiResponse } from '@/types/common';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { RadioGroupField } from '../ui/form/radio-group-field';

interface SystemUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ISystemUserPayload) => Promise<void>;
  mode: 'add' | 'edit' | 'view';
  user?: SystemUser;
  isSubmitting: boolean;
}

const getInitialValues = (
  mode: 'add' | 'edit' | 'view',
  user?: SystemUser
): SystemUserFormValues => {
  if (mode === 'add') {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      roleId: '',
      status: 'active',
      checkerId: null,
    };
  }

  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddress || '',
    phoneNumber: user?.mobileNumber || '',
    roleId: user?.roleId || '',
    status: user?.status ? 'active' : 'inactive',
    checkerId: user?.checkerId || null,
  };
};

export function SystemUserModal({
  open,
  onClose,
  onSubmit,
  mode = 'add',
  user,
  isSubmitting,
}: SystemUserModalProps) {
  const isViewMode = mode === 'view';
  const modalTitle = {
    add: 'Add System User',
    edit: 'Edit System User',
    view: 'View System User',
  }[mode];

  const form = useForm<SystemUserFormValues>({
    resolver: zodResolver(systemUserFormSchema),
    defaultValues: getInitialValues(mode, user),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(mode, user));
    }
  }, [open, mode, user, form]);

  // Fetch roles and checkers
  const { data: rolesData } = useSWR<IApiResponse<IRoleResponse>>(
    open ? BACKEND_ENDPOINTS.ROLE.LIST() : null
  );
  const { data: checkersData } = useSWR<IApiResponse<ICheckerResponse>>(
    open && form.watch('status') === 'inactive'
      ? BACKEND_ENDPOINTS.SYSTEM_USER.CHECKERS
      : null
  );

  const roles = rolesData?.data?.roles || [];
  const checkers = checkersData?.data?.checkerList || [];

  const handleSubmit = async (values: SystemUserFormValues) => {
    if (isViewMode) return;

    try {
      const payload: ISystemUserPayload = {
        metaInfo: getMetaInfo(),
        attribute: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          roleId: values.roleId,
          status: values.status === 'active',
          checkerId: values.status ? null : values.checkerId,
        },
      };

      await onSubmit(payload);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting system user:', error);
    }
  };

  // Don't render if user is not loaded in view mode
  if (mode === 'view' && !user) return null;

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
                  name='roleId'
                  form={form}
                  label='Role'
                  options={roles.map((role) => ({
                    label: role.roleName,
                    value: role.id.toString(),
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
