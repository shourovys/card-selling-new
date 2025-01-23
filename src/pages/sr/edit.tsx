import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import { sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { DatePickerField } from '@/components/ui/form/date-picker-field';
import { FileUploadField } from '@/components/ui/form/file-upload-field';
import { InputField } from '@/components/ui/form/input-field';
import { RadioGroupField } from '@/components/ui/form/radio-group-field';
import { SelectField } from '@/components/ui/form/select-field';
import { routeConfig } from '@/config/routeConfig';
import { useToast } from '@/hooks/use-toast';
import { IDistributorResponse } from '@/lib/validations/distributor';
import {
  IAreaResponse,
  ICheckerResponse,
  ICityResponse,
  ICountryResponse,
  IDocumentTypeResponse,
  ISRPayload,
  SR,
  SRFormValues,
  srFormSchema,
} from '@/lib/validations/sr';
import { ISubDistributorResponse } from '@/lib/validations/sub-distributor';
import { IApiRequestWithMetaData, IApiResponse } from '@/types/common';
import fileToBase64 from '@/utils/fileToBase64';
import { getMetaInfo } from '@/utils/getMetaInfo';
import dayjs from 'dayjs';

export default function EditSR() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const form = useForm<SRFormValues>({
    resolver: zodResolver(srFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
      gender: 'male',
      photo: null,
      countryId: '',
      cityId: '',
      areaId: '',
      addressLine: '',
      level: '',
      verificationType: '',
      verificationDocument: null,
      issueDate: null,
      expireDate: null,
      distributorId: '',
      subDistributorId: '',
      status: 'active',
      checkerId: null,
      remarks: '',
    },
  });

  // Fetch SR details
  const { data: srData, error: srError } = useSWR<IApiResponse<{ sr: SR }>>(
    id ? BACKEND_ENDPOINTS.SR.DETAILS(id) : null
  );

  // Fetch distributors and sub distributors
  const { data: distributorsData } = useSWR<IApiResponse<IDistributorResponse>>(
    BACKEND_ENDPOINTS.DISTRIBUTOR.LIST('')
  );

  const { data: subDistributorsData } = useSWR<
    IApiResponse<ISubDistributorResponse>
  >(BACKEND_ENDPOINTS.SUB_DISTRIBUTOR.LIST(''));

  const { data: checkersData } = useSWR<IApiResponse<ICheckerResponse>>(
    BACKEND_ENDPOINTS.SR.CHECKERS
  );

  // Fetch location data
  const { data: countriesData } = useSWR<ICountryResponse>(
    BACKEND_ENDPOINTS.LOCATION.COUNTRIES
  );

  const { data: citiesData } = useSWR<ICityResponse>(
    form.getValues('countryId')
      ? BACKEND_ENDPOINTS.LOCATION.CITIES(form.getValues('countryId'))
      : null
  );

  const { data: areasData } = useSWR<IAreaResponse>(
    form.getValues('cityId')
      ? BACKEND_ENDPOINTS.LOCATION.AREAS(form.getValues('cityId'))
      : null
  );

  // Fetch document types
  const { data: documentTypesData } = useSWR<IDocumentTypeResponse>(
    BACKEND_ENDPOINTS.DOCUMENT.TYPES
  );

  const distributors = distributorsData?.data.distributors || [];
  const subDistributors = subDistributorsData?.data?.distributors || [];
  const checkers = checkersData?.data?.checkerList || [];
  const countries = countriesData?.data?.countryList || [];
  const cities = citiesData?.data?.cityList || [];
  const areas = areasData?.data?.areaList || [];
  const documentTypes = documentTypesData?.data?.documentList || [];

  useEffect(() => {
    if (srData?.data?.sr) {
      const sr = srData.data.sr;
      form.reset({
        firstName: sr.firstName,
        lastName: sr.lastName,
        email: sr.emailAddress,
        phoneNumber: sr.mobileNumber,
        dateOfBirth: sr.dateOfBirth ? new Date(sr.dateOfBirth) : null,
        gender: sr.gender,
        photo: sr.userImage || null,
        countryId: sr.country,
        cityId: sr.city,
        areaId: sr.area,
        addressLine: sr.address,
        level: sr.level,
        verificationType: sr.verificationType,
        verificationDocument: sr.verificationDocument || null,
        issueDate: sr.issueDate ? new Date(sr.issueDate) : null,
        expireDate: sr.expireDate ? new Date(sr.expireDate) : null,
        distributorId: '',
        subDistributorId: sr.subDistributorId,
        status: sr.status ? 'active' : 'inactive',
        checkerId: sr.checkerId,
        remarks: sr.remarks || '',
      });
    }
  }, [srData, form]);

  useEffect(() => {
    const countryId = form.watch('countryId');
    if (countryId) {
      form.setValue('cityId', '');
      form.setValue('areaId', '');
    }
  }, [form.watch('countryId')]);

  useEffect(() => {
    const cityId = form.watch('cityId');
    if (cityId) {
      form.setValue('areaId', '');
    }
  }, [form.watch('cityId')]);

  const onSubmit = async (values: SRFormValues) => {
    if (!id) return;

    try {
      const payload: IApiRequestWithMetaData<ISRPayload> = {
        metaInfo: getMetaInfo(),
        attribute: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
          gender: values.gender,
          level: values.level,
          countryId: values.countryId,
          cityId: values.cityId,
          areaId: values.areaId,
          addressLine: values.addressLine,
          photo: values.photo ? await fileToBase64(values.photo) : undefined,
          verificationType: Number(values.verificationType),
          verificationDocument: values.verificationDocument
            ? await fileToBase64(values.verificationDocument)
            : undefined,
          remarks: values.remarks,
          issueDate: dayjs(values.issueDate).format('YYYY-MM-DD'),
          expireDate: dayjs(values.expireDate).format('YYYY-MM-DD'),
          distributorId: values.distributorId,
          subDistributorId: values.subDistributorId,
          status: values.status === 'active',
          checkerId: values.checkerId,
        },
      };

      await sendPutRequest(BACKEND_ENDPOINTS.SR.UPDATE(id), { arg: payload });
      toast({
        title: 'Success',
        description: 'Sales representative updated successfully',
      });
      navigate(routeConfig.sr.path());
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Error',
        description: err?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  if (srError) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-destructive'>Failed to load SR details</p>
      </div>
    );
  }

  if (!srData?.data?.sr) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Breadcrumbs />

      <Card>
        <CardContent className='p-10'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
              {/* Personal Information */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold text-secondary'>
                  Personal Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <InputField
                    name='firstName'
                    form={form}
                    label='First Name'
                    required
                  />
                  <InputField
                    name='lastName'
                    form={form}
                    label='Last Name'
                    required
                  />
                  <DatePickerField
                    name='dateOfBirth'
                    form={form}
                    label='Date of Birth'
                    required
                  />
                  <RadioGroupField
                    name='gender'
                    form={form}
                    label='Gender'
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other', value: 'other' },
                    ]}
                    required
                  />
                  <div className='col-span-2'>
                    <FileUploadField
                      name='photo'
                      form={form}
                      label='User Image'
                      value={form.watch('photo')}
                      onChange={(file) => {
                        form.setValue('photo', file);
                        form.trigger('photo');
                      }}
                      preview
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold text-secondary'>
                  Contact Details
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <InputField
                    name='email'
                    form={form}
                    label='Email'
                    type='email'
                    required
                  />
                  <InputField
                    name='phoneNumber'
                    form={form}
                    label='Phone Number'
                    required
                  />
                  <SelectField
                    name='countryId'
                    form={form}
                    label='Country'
                    options={countries.map((country) => ({
                      label: country.countryName,
                      value: country.id,
                    }))}
                    required
                  />
                  <SelectField
                    name='cityId'
                    form={form}
                    label='City'
                    options={cities.map((city) => ({
                      label: city.cityName,
                      value: city.id,
                    }))}
                    disabled={!form.getValues('countryId')}
                    required
                  />
                  <SelectField
                    name='areaId'
                    form={form}
                    label='Area'
                    options={areas.map((area) => ({
                      label: area.areaName,
                      value: area.id,
                    }))}
                    disabled={!form.getValues('cityId')}
                    required
                  />
                  <InputField
                    name='addressLine'
                    form={form}
                    label='Address'
                    required
                  />
                </div>
              </div>

              {/* Verification Details */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold text-secondary'>
                  Verification Details
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <SelectField
                    name='level'
                    form={form}
                    label='Level'
                    options={[
                      {
                        value: 'Own Mandop',
                        label: 'Own Mandop',
                      },
                      {
                        value: 'Freelance Mandop',
                        label: 'Freelance Mandop',
                      },
                      {
                        value: 'Main Agent',
                        label: 'Main Agent',
                      },
                    ]}
                    required
                  />
                  <SelectField
                    name='verificationType'
                    form={form}
                    label='Verification Type'
                    options={documentTypes.map((type) => ({
                      label: type.value,
                      value: type.id.toString(),
                    }))}
                    required
                  />
                  <div className='col-span-2'>
                    <FileUploadField
                      name='verificationDocument'
                      form={form}
                      label='Verification Document'
                      value={form.watch('verificationDocument')}
                      onChange={(file) => {
                        form.setValue('verificationDocument', file);
                        form.trigger('verificationDocument');
                      }}
                      preview
                      required
                    />
                  </div>
                  <DatePickerField
                    name='issueDate'
                    form={form}
                    label='Issue Date'
                    required
                  />
                  <DatePickerField
                    name='expireDate'
                    form={form}
                    label='Expire Date'
                    required
                  />
                </div>
              </div>

              {/* Account Details */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold text-secondary'>
                  Account Details
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <SelectField
                    name='distributorId'
                    form={form}
                    label='Distributor'
                    options={distributors.map((distributor) => ({
                      label: `${distributor.firstName} ${distributor.lastName}`,
                      value: distributor.userId,
                    }))}
                    required
                  />
                  <SelectField
                    name='subDistributorId'
                    form={form}
                    label='Sub Distributor'
                    options={subDistributors.map((subDistributor) => ({
                      label: `${subDistributor.firstName} ${subDistributor.lastName}`,
                      value: subDistributor.userId,
                    }))}
                    required
                  />
                  <RadioGroupField
                    name='status'
                    form={form}
                    label='Status'
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                    required
                  />
                  <SelectField
                    name='checkerId'
                    form={form}
                    label='Checker'
                    options={checkers.map((checker) => ({
                      label: checker.name,
                      value: checker.userId,
                    }))}
                    required
                  />
                  <div className='col-span-2'>
                    <InputField
                      name='remarks'
                      form={form}
                      label='Remarks'
                      rows={6}
                      multiline
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate('/sr')}
                >
                  Cancel
                </Button>
                <Button type='submit'>Update</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
