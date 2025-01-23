import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/ui/form/input-field';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@cardselling.com',
      password: 'Password100@',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Welcome back</h1>
        <p className='text-sm text-gray-500'>
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <div className='relative'>
            <Mail className='absolute left-4 top-[37px] h-[18px] w-[18px] text-gray-400 pointer-events-none' />
            <InputField
              name='email'
              type='email'
              form={form}
              label='Email'
              className='h-12 pl-11'
            />
          </div>

          <div className='relative'>
            <Lock className='absolute left-4 top-[37px] h-[18px] w-[18px] text-gray-400 pointer-events-none' />
            <InputField
              name='password'
              type='password'
              form={form}
              label='Password'
              className='h-12 pl-11'
            />
          </div>

          <Button
            type='submit'
            className='w-full h-12 bg-primary hover:bg-rose-600 text-white transition-colors'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className='flex items-center justify-center'>
            <a href='#' className='text-sm text-primary hover:text-rose-600'>
              Forgot password?
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
