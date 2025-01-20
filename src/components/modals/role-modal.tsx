import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Permission,
  PermissionGroup,
  RoleFormValues,
  roleFormSchema,
} from '@/lib/validations/role';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '../ui/form/input-field';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormValues) => void;
  mode: 'add' | 'edit' | 'view';
  role?: RoleFormValues;
  isSubmitting?: boolean;
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
}

const getInitialValues = (role?: RoleFormValues): RoleFormValues => {
  if (role) {
    return {
      roleName: role.roleName,
      permissions: role.permissions,
    };
  }
  return {
    roleName: '',
    permissions: [],
  };
};

export const RoleModal = ({
  open,
  onClose,
  onSubmit,
  mode,
  role,
  isSubmitting,
  permissions,
  permissionGroups,
}: RoleModalProps) => {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: getInitialValues(role),
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(role));
    }
  }, [form, open, role]);

  const handleSubmit = useCallback(
    (data: RoleFormValues) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  const isViewMode = mode === 'view';
  const title = useMemo(() => {
    switch (mode) {
      case 'add':
        return 'Add Role';
      case 'edit':
        return 'Edit Role';
      case 'view':
        return 'View Role';
      default:
        return '';
    }
  }, [mode]);

  // Group permissions by their group
  const groupedPermissions = useMemo(() => {
    const permissionsByGroup = new Map<number, Permission[]>();
    permissions.forEach((permission) => {
      if (permission.groupId) {
        const group = permissionsByGroup.get(permission.groupId) || [];
        group.push(permission);
        permissionsByGroup.set(permission.groupId, group);
      }
    });
    return permissionsByGroup;
  }, [permissions]);

  // Handle select all permissions for a group
  const handleSelectAllGroup = useCallback(
    (groupId: number, checked: boolean) => {
      const groupPermissions = groupedPermissions.get(groupId);
      if (!groupPermissions) return;

      const currentPermissions = new Set(form.getValues('permissions') || []);
      const groupPermissionNames = groupPermissions.map(
        (p) => p.permissionName
      );

      if (checked) {
        // Add all permissions from the group
        groupPermissionNames.forEach((p) => currentPermissions.add(p));
      } else {
        // Remove all permissions from the group
        groupPermissionNames.forEach((p) => currentPermissions.delete(p));
      }

      form.setValue('permissions', Array.from(currentPermissions), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [form, groupedPermissions]
  );

  // Check if all permissions in a group are selected
  const isGroupSelected = useCallback(
    (groupId: number) => {
      const groupPermissions = groupedPermissions.get(groupId);
      if (!groupPermissions || groupPermissions.length === 0) return false;

      const currentPermissions = new Set(form.getValues('permissions') || []);
      return groupPermissions.every((p) =>
        currentPermissions.has(p.permissionName)
      );
    },
    [form, groupedPermissions]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[1000px] p-0 gap-0'>
        <DialogHeader className='px-8 py-6 border-b'>
          <DialogTitle className='text-xl font-medium'>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='contents'>
            <div className='px-8 py-4 pb-8 max-h-[calc(100vh-200px)] overflow-y-auto'>
              {/* <ScrollArea className='h-[calc(85vh-250px)] pr-4 -mr-4'> */}
              <div className='space-y-6'>
                <InputField
                  name='roleName'
                  form={form}
                  label='Role Name'
                  disabled={isViewMode}
                />

                <div>
                  <FormLabel className='text-sm font-medium'>
                    Permissions
                  </FormLabel>
                  <div className='mt-3 space-y-4 grid grid-cols-2 gap-x-10 gap-y-6'>
                    {Array.from(groupedPermissions.entries()).map(
                      ([groupId, groupPermissions]) => {
                        const group = permissionGroups.find(
                          (g) => g.id === groupId
                        );
                        return (
                          <div
                            key={groupId}
                            className='space-y-3 border-b pb-6'
                          >
                            <FormField
                              control={form.control}
                              name='permissions'
                              render={() => (
                                <FormItem className='space-y-3'>
                                  <div className='flex items-center gap-2'>
                                    <Checkbox
                                      id={`group-${groupId}`}
                                      checked={isGroupSelected(groupId)}
                                      onCheckedChange={(checked) =>
                                        handleSelectAllGroup(
                                          groupId,
                                          checked as boolean
                                        )
                                      }
                                      disabled={isViewMode}
                                      className='h-4 w-4 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500'
                                    />
                                    <label
                                      htmlFor={`group-${groupId}`}
                                      className='text-sm font-medium cursor-pointer'
                                    >
                                      {group?.groupName}
                                    </label>
                                  </div>
                                  <div className='grid grid-cols-2 gap-x-6 gap-y-2 ml-6'>
                                    {groupPermissions.map((permission) => (
                                      <FormField
                                        key={permission.permissionName}
                                        control={form.control}
                                        name='permissions'
                                        render={({ field }) => (
                                          <FormItem
                                            key={permission.permissionName}
                                            className='flex flex-row items-center space-x-2 space-y-0'
                                          >
                                            <FormControl>
                                              <Checkbox
                                                id={permission.permissionName}
                                                checked={field.value?.includes(
                                                  permission.permissionName
                                                )}
                                                onCheckedChange={(checked) => {
                                                  const newPermissions = checked
                                                    ? [
                                                        ...(field.value || []),
                                                        permission.permissionName,
                                                      ]
                                                    : field.value?.filter(
                                                        (value) =>
                                                          value !==
                                                          permission.permissionName
                                                      ) || [];

                                                  field.onChange(
                                                    newPermissions
                                                  );
                                                }}
                                                disabled={isViewMode}
                                                className='h-4 w-4 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500'
                                              />
                                            </FormControl>
                                            <label
                                              htmlFor={
                                                permission.permissionName
                                              }
                                              className='text-sm font-normal cursor-pointer'
                                            >
                                              {permission.displayName}
                                            </label>
                                          </FormItem>
                                        )}
                                      />
                                    ))}
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              {/* </ScrollArea> */}
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
                    {mode === 'add' ? 'Clear' : 'Cancel'}
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    className='min-w-[120px] min-h-[36px] bg-primary hover:bg-primary/90'
                  >
                    {mode === 'add' ? 'Confirm' : 'Update'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
