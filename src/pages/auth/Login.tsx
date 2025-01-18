import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/ui/form/input-field';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@cardselling.com',
      password: 'Password100@',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='p-6 mx-auto w-full max-w-md'>
      <h2 className='mb-6 text-2xl font-bold text-center'>Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <InputField name='email' form={form} label='Email' />
          <InputField
            name='password'
            form={form}
            label='Password'
            type='password'
          />
          <Button type='submit' className='w-full'>
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
