import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  smallLabel?: string;
  description?: string;
  className?: string;
  required?: boolean;
};

interface FileUploadFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  preview?: boolean;
  disabled?: boolean;
  height?: number;
  maxHeight?: number;
}

export function FileUploadField<T extends FieldValues>({
  name,
  form,
  label,
  smallLabel,
  description,
  className,
  required = false,
  value,
  onChange,
  acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5, // in MB
  preview = true,
  disabled = false,
  height = 146,
}: FileUploadFieldProps<T>) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const error = form.formState.errors[name];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onChange(acceptedFiles[0]);
      }
    },
    accept: acceptedTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {} as Accept
    ),
    maxSize: maxSize * 1024 * 1024,
    disabled,
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  });

  const handleDelete = () => {
    onChange(null);
    setDeleteDialogOpen(false);
  };

  const getFilePreview = () => {
    if (!value) return null;
    if (value instanceof File) {
      if (value.type.startsWith('image/')) {
        return URL.createObjectURL(value);
      }
      return null;
    }
    return value as string;
  };

  const previewUrl = getFilePreview();
  const inputProps = getInputProps();

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {label && (
            <FormLabel className='flex gap-1 items-center'>
              {label}
              {smallLabel && (
                <span className='text-small text-muted-foreground leading-none'>
                  {smallLabel}
                </span>
              )}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                'relative rounded-md border transition-colors',
                'focus-within:outline-none focus-within:ring-1 focus-within:ring-offset-0',
                error
                  ? 'border-destructive focus-within:ring-destructive'
                  : 'border-input focus-within:ring-ring focus-within:border-ring',

                isDragActive && !disabled && 'border-primary bg-primary/5',
                disabled
                  ? 'cursor-default bg-input-disabled-background border-input-border'
                  : 'hover:border-input-borderHover'
                // !value && 'border-dashed'
              )}
              style={{ height }}
            >
              {preview && value ? (
                <div className='flex justify-center items-center p-2'>
                  <div
                    className={cn(
                      'overflow-hidden rounded-md border bg-background w-fit mx-auto',
                      disabled && 'opacity-50'
                    )}
                  >
                    {previewUrl ? (
                      <div className='flex flex-col'>
                        <div
                          className='flex justify-center items-center p-2'
                          style={{
                            height: disabled ? height - 22 : height - 54,
                          }}
                        >
                          <img
                            src={previewUrl}
                            alt='Preview'
                            className='max-w-full max-h-full object-contain'
                            style={{ maxHeight: '100%' }}
                          />
                        </div>
                        {!disabled && (
                          <div className='flex w-full border-t'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='flex-1 h-[32px] text-[10px] rounded-none border-r text-secondary hover:bg-secondary/20'
                              onClick={() => setPreviewOpen(true)}
                            >
                              PREVIEW
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='flex-1 h-[32px] text-[10px] rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive'
                              onClick={() => setDeleteDialogOpen(true)}
                            >
                              DELETE
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='flex gap-2 justify-between items-center py-3 pr-2 pl-4'>
                        <div className='text-sm text-center text-muted-foreground'>
                          File uploaded (No preview available)
                        </div>
                        {!disabled && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
                            onClick={() => setDeleteDialogOpen(true)}
                          >
                            DELETE
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    'flex justify-center items-center p-2 w-full h-full min-h-max',
                    !disabled && 'cursor-pointer',
                    disabled && 'cursor-not-allowed'
                  )}
                >
                  <input {...inputProps} accept={acceptedTypes.join(',')} />
                  <div className='flex flex-col gap-2 items-center text-center'>
                    <UploadCloud
                      className={cn(
                        'size-10',
                        disabled
                          ? 'text-input-disabled-text'
                          : 'text-muted-foreground'
                      )}
                    />
                    <div className='space-y-1'>
                      <p
                        className={cn(
                          'text-base font-medium',
                          disabled
                            ? 'text-input-disabled-text'
                            : 'text-muted-foreground'
                        )}
                      >
                        {disabled
                          ? 'No file uploaded'
                          : 'Upload your files here'}
                      </p>
                      {!disabled && (
                        <p className='text-sm text-muted-foreground'>
                          Or you can drag and drop your file
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {error && <FormMessage />}

          {/* Preview Dialog */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className='p-0 max-w-3xl'>
              <div className='relative'>
                <Button
                  type='button'
                  size='icon'
                  variant='destructive'
                  className='absolute top-2 right-2 z-10'
                  onClick={() => setPreviewOpen(false)}
                >
                  <X className='w-4 h-4' />
                </Button>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='max-h-[80vh] w-full object-contain'
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className=''>
              <DialogHeader className=''>
                <DialogTitle>Delete File</DialogTitle>
              </DialogHeader>
              <p className='text-sm text-muted-foreground'>
                Are you sure you want to delete this file?
              </p>
              <DialogFooter className='gap-2 sm:gap-0'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </FormItem>
      )}
    />
  );
}
