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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Permission,
  PermissionGroup,
  RoleFormValues,
  roleFormSchema,
} from '@/lib/validations/role';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

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

  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(role));
    }
  }, [form, open, role]);

  const handleSubmit = (data: RoleFormValues) => {
    onSubmit(data);
  };

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
    const groups = new Map<number, Permission[]>();
    permissions.forEach((permission) => {
      const group = groups.get(permission.groupId) || [];
      group.push(permission);
      groups.set(permission.groupId, group);
    });
    return groups;
  }, [permissions]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='roleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter role name'
                      disabled={isViewMode}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='permissions'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel>Permissions</FormLabel>
                    <FormDescription>
                      Select the permissions for this role.
                    </FormDescription>
                  </div>
                  {Array.from(groupedPermissions.entries()).map(
                    ([groupId, groupPermissions]) => {
                      const group = permissionGroups.find(
                        (g) => g.id === groupId
                      );
                      return (
                        <div key={groupId} className='mb-6'>
                          <h4 className='text-sm font-medium mb-2'>
                            {group?.groupName || 'Other'}
                          </h4>
                          <div className='grid grid-cols-2 gap-4'>
                            {groupPermissions.map((permission) => (
                              <FormField
                                key={permission.permissionName}
                                control={form.control}
                                name='permissions'
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={permission.permissionName}
                                      className='flex flex-row items-start space-x-3 space-y-0'
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            permission.permissionName
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  permission.permissionName,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !==
                                                      permission.permissionName
                                                  )
                                                );
                                          }}
                                          disabled={isViewMode}
                                        />
                                      </FormControl>
                                      <FormLabel className='font-normal'>
                                        {permission.displayName}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {!isViewMode && (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
