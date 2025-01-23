import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Page from '@/components/HOC/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/ui/form/input-field';
import { SelectField } from '@/components/ui/form/select-field';
import { toast } from '@/hooks/use-toast';
import {
  VirtualMoneyFormValues,
  virtualMoneyFormSchema,
} from '@/lib/validations/virtual-money';
import { IApiResponse } from '@/types/common';
import { getMetaInfo } from '@/utils/getMetaInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function RequestVirtualMoney() {
  const form = useForm<VirtualMoneyFormValues>({
    resolver: zodResolver(virtualMoneyFormSchema),
    defaultValues: {
      amount: '',
      remarks: '',
      approverUserCode: '',
    },
  });

  const { data: approvers } = useSWR<
    IApiResponse<{ approverList: { userCode: string; name: string }[] }>
  >(BACKEND_ENDPOINTS.VIRTUAL_MONEY.APPROVER_LIST);

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.VIRTUAL_MONEY.GENERATE,
    sendPostRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Virtual money generated successfully',
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description:
            error?.response?.data?.error?.reason[0] ||
            'Failed to generate virtual money',
          variant: 'destructive',
        });
      },
    }
  );

  const handleSubmit = async (values: VirtualMoneyFormValues) => {
    await trigger({
      metaInfo: getMetaInfo(),
      attribute: {
        amount: parseFloat(values.amount),
        approverUserCode: values.approverUserCode,
        remarks: values.remarks?.trim() || '',
      },
    });
  };

  return (
    <Page>
      <div className='flex items-center justify-center min-h-[calc(100vh-100px)]'>
        <Card className='w-full max-w-[800px] bg-white rounded-lg p-8'>
          <h2 className='text-2xl font-medium mb-6'>Request Virtual Money</h2>
          <div className='border-t border-gray-200 pt-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-2 gap-8'>
                  <InputField
                    name='amount'
                    form={form}
                    label='Amount'
                    type='number'
                    required
                  />

                  <SelectField
                    name='approverUserCode'
                    form={form}
                    label='Select Approver'
                    options={
                      approvers?.data.approverList.map((approver) => ({
                        label: approver.name,
                        value: approver.userCode,
                      })) || []
                    }
                    required
                    isClearable={false}
                  />
                </div>

                <InputField
                  name='remarks'
                  form={form}
                  label='Remarks'
                  multiline
                  rows={4}
                />

                <div className='flex justify-end border-t border-gray-200 pt-6'>
                  <Button
                    type='submit'
                    disabled={isMutating}
                    className='min-w-[120px]'
                  >
                    SUBMIT
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </Page>
  );
}
