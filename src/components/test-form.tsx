import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Form } from './ui/form';
import { DatePickerField } from './ui/form/date-picker-field';
import { FileUploadField } from './ui/form/file-upload-field';
import { InputField } from './ui/form/input-field';
import { MultiSelectField } from './ui/form/multi-select-field';
import { RadioGroupField } from './ui/form/radio-group-field';
import { SelectField } from './ui/form/select-field';
import { ServerSelectField } from './ui/form/server-select-field';

const formSchema = z.object({
  input: z.string().min(2, 'Input must be at least 2 characters'),
  select: z.string().min(1, 'Please select an option'),
  multiSelect: z.array(z.string()).min(1, 'Please select at least one option'),
  radio: z.string().min(1, 'Please select an option'),
  date: z.date(),
  file: z.any().refine((file) => file !== null, {
    message: 'File is required',
  }),
  serverSelect: z.object({
    label: z.string().min(1, 'Please select an option'),
    value: z.string().min(1, 'Please select an option'),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const selectOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
  { label: 'Option 6', value: 'option6' },
  { label: 'Option 7', value: 'option7' },
  { label: 'Option 8', value: 'option8' },
  { label: 'Option 9', value: 'option9' },
  { label: 'Option 10', value: 'option10' },
  { label: 'Option 11', value: 'option11' },
  { label: 'Option 12', value: 'option12' },
  { label: 'Option 13', value: 'option13' },
  { label: 'Option 14', value: 'option14' },
  { label: 'Option 15', value: 'option15' },
];

const radioOptions = [
  { label: 'Radio 1', value: 'radio1', description: 'Description for Radio 1' },
  { label: 'Radio 2', value: 'radio2', description: 'Description for Radio 2' },
  { label: 'Radio 3', value: 'radio3', description: 'Description for Radio 3' },
];

export function TestForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // input: '',
      // select: '',
      // multiSelect: [],
      // radio: '',
      // date: undefined,
      // file: null,
      // serverSelect: '',

      input: 'tang',
      select: 'option5',
      multiSelect: ['option2', 'option3'],
      radio: 'radio2',
      date: new Date('2025-01-02T10:25:05.863Z'),
      file: {
        path: './image_2024_10_10T09_42_31_070Z (1).png',
        relativePath: './image_2024_10_10T09_42_31_070Z (1).png',
      },
      serverSelect: {
        label: 'Option 2',
        value: 'option2',
      },
    },
  });
  console.log('🚀 ~ TestForm ~ form:', form.watch());

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  // Mock function for server select options
  const fetchServerOptions = async ({ search }: { search: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    const filteredOptions = selectOptions
      .filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
      .map((option) => ({
        ...option,
        value: String(option.value),
      }));

    return filteredOptions;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Form</CardTitle>
        <CardDescription>
          This form demonstrates all available form field components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <InputField
              name='input'
              form={form}
              label='Input Field'
              description='This is a basic input field'
              required
            />

            <SelectField
              name='select'
              form={form}
              label='Select Field'
              description='This is a select field'
              options={selectOptions}
              required
            />

            <MultiSelectField
              name='multiSelect'
              form={form}
              label='Multi Select Field'
              description='This is a multi select field'
              options={selectOptions}
              required
            />

            <RadioGroupField
              name='radio'
              form={form}
              label='Radio Group Field'
              description='This is a radio group field'
              options={radioOptions}
              required
            />

            <DatePickerField
              name='date'
              form={form}
              label='Date Picker Field'
              description='This is a date picker field'
              required
            />

            <FileUploadField
              name='file'
              form={form}
              label='File Upload Field'
              description='This is a file upload field'
              value={form.watch('file')}
              onChange={(file) => form.setValue('file', file)}
              preview
            />

            <ServerSelectField
              name='serverSelect'
              form={form}
              label='Server Select Field'
              fetchOptions={fetchServerOptions}
              required
              loadingMessage='Loading results...'
              noOptionsMessage='No options found'
            />

            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
