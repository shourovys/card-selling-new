// import BACKEND_ENDPOINTS from '@/api/urls';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Form } from '@/components/ui/form';
// import { InputField } from '@/components/ui/form/input-field';
// import { RadioGroupField } from '@/components/ui/form/radio-group-field';
// import { SelectField } from '@/components/ui/form/select-field';
// import {
//   ICheckerResponse,
//   ISRPayload,
//   ISubDistributorResponse,
//   SR,
//   SRFormValues,
//   srFormSchema,
// } from '@/lib/validations/sr';
// import { IApiResponse } from '@/types/common';
// import { getMetaInfo } from '@/utils/getMetaInfo';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import useSWR from 'swr';

// interface SRModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (values: ISRPayload) => Promise<void>;
//   mode: 'add' | 'edit' | 'view';
//   sr?: SR;
//   isSubmitting: boolean;
// }

// const getInitialValues = (
//   mode: 'add' | 'edit' | 'view',
//   sr?: SR
// ): SRFormValues => {
//   if (mode === 'add') {
//     return {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phoneNumber: '',
//       subDistributorId: '',
//       status: 'active',
//       checkerId: null,
//     };
//   }

//   return {
//     firstName: sr?.firstName || '',
//     lastName: sr?.lastName || '',
//     email: sr?.emailAddress || '',
//     phoneNumber: sr?.mobileNumber || '',
//     subDistributorId: sr?.subDistributorId || '',
//     status: sr?.status ? 'active' : 'inactive',
//     checkerId: sr?.checkerId || null,
//   };
// };

// export function SRModal({
//   open,
//   onClose,
//   onSubmit,
//   mode = 'add',
//   sr,
//   isSubmitting,
// }: SRModalProps) {
//   const isViewMode = mode === 'view';
//   const modalTitle = {
//     add: 'Add Sales Representative',
//     edit: 'Edit Sales Representative',
//     view: 'View Sales Representative',
//   }[mode];

//   const form = useForm<SRFormValues>({
//     resolver: zodResolver(srFormSchema),
//     defaultValues: getInitialValues(mode, sr),
//   });

//   // Reset form when modal opens/closes or mode changes
//   useEffect(() => {
//     if (open) {
//       form.reset(getInitialValues(mode, sr));
//     }
//   }, [open, mode, sr, form]);

//   // Fetch sub distributors and checkers
//   const { data: subDistributorsData } = useSWR<
//     IApiResponse<ISubDistributorResponse>
//   >(open ? BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.LIST('') : null);

//   const { data: checkersData } = useSWR<IApiResponse<ICheckerResponse>>(
//     open && form.watch('status') === 'inactive'
//       ? BACKEND_ENDPOINTS.SR.CHECKERS
//       : null
//   );

//   const subDistributors =
//     subDistributorsData?.data?.data?.subDistributorList || [];
//   const checkers = checkersData?.data?.data?.checkerList || [];

//   const handleSubmit = async (values: SRFormValues) => {
//     if (isViewMode) return;

//     try {
//       const payload: ISRPayload = {
//         metaInfo: getMetaInfo(),
//         attribute: {
//           firstName: values.firstName,
//           lastName: values.lastName,
//           email: values.email,
//           phoneNumber: values.phoneNumber,
//           subDistributorId: values.subDistributorId,
//           status: values.status === 'active',
//           checkerId: values.status === 'active' ? null : values.checkerId,
//         },
//       };

//       await onSubmit(payload);
//       onClose();
//       form.reset();
//     } catch (error) {
//       console.error('Error submitting sales representative:', error);
//     }
//   };

//   // Don't render if SR is not loaded in view mode
//   if (mode === 'view' && !sr) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className='max-w-[600px] p-0'>
//         <DialogHeader className='px-8 py-6 border-b'>
//           <DialogTitle className='text-lg font-medium'>
//             {modalTitle}
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)}>
//             <div className='px-8 py-4 pb-8 space-y-6'>
//               <div className='grid grid-cols-2 gap-8'>
//                 <InputField
//                   name='firstName'
//                   form={form}
//                   label='First Name'
//                   required
//                   disabled={isViewMode}
//                 />

//                 <InputField
//                   name='lastName'
//                   form={form}
//                   label='Last Name'
//                   required
//                   disabled={isViewMode}
//                 />
//               </div>

//               <div className='grid grid-cols-2 gap-8'>
//                 <InputField
//                   name='email'
//                   form={form}
//                   label='Email'
//                   type='email'
//                   required
//                   disabled={isViewMode}
//                 />

//                 <InputField
//                   name='phoneNumber'
//                   form={form}
//                   label='Phone Number'
//                   required
//                   disabled={isViewMode}
//                 />
//               </div>

//               <div className='grid grid-cols-2 gap-8'>
//                 <SelectField
//                   name='subDistributorId'
//                   form={form}
//                   label='Sub Distributor'
//                   options={subDistributors.map((subDistributor) => ({
//                     label: subDistributor.name,
//                     value: subDistributor.userId,
//                   }))}
//                   required
//                   disabled={isViewMode}
//                 />

//                 <RadioGroupField
//                   name='status'
//                   form={form}
//                   label='Status'
//                   options={[
//                     { label: 'Active', value: 'active' },
//                     { label: 'Inactive', value: 'inactive' },
//                   ]}
//                   required
//                   disabled={isViewMode}
//                 />
//               </div>

//               {form.watch('status') === 'inactive' && (
//                 <div className='grid grid-cols-2 gap-8'>
//                   <SelectField
//                     name='checkerId'
//                     form={form}
//                     label='Checker'
//                     options={checkers.map((checker) => ({
//                       label: checker.name,
//                       value: checker.userId,
//                     }))}
//                     required
//                     disabled={isViewMode}
//                   />
//                 </div>
//               )}
//             </div>

//             <DialogFooter className='gap-2 px-8 py-6 border-t'>
//               {isViewMode ? (
//                 <Button
//                   type='button'
//                   variant='outline'
//                   onClick={onClose}
//                   className='min-w-[120px] min-h-[36px]'
//                 >
//                   Close
//                 </Button>
//               ) : (
//                 <>
//                   <Button type='button' variant='outline' onClick={onClose}>
//                     Clear
//                   </Button>
//                   <Button
//                     disabled={isSubmitting}
//                     type='submit'
//                     className='min-w-[120px] min-h-[36px] bg-primary hover:bg-primary/90'
//                   >
//                     {mode === 'add' ? 'Create' : 'Update'}
//                   </Button>
//                 </>
//               )}
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
