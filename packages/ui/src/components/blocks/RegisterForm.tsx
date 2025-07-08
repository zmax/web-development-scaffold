import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormSchema, RegisterFormData } from '@axiom/types/api';
import { Input } from '../base/input';
import { Label } from '../base/label';
import { Button } from '../base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../base/card';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>註冊</CardTitle>
        <CardDescription>建立您的帳戶。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>名稱</Label>
            <Input
              id='name'
              type='text'
              placeholder='您的名稱'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>電子郵件</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              {...register('email')}
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>密碼</Label>
            <Input id='password' type='password' {...register('password')} />
            {errors.password && (
              <p className='text-sm text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>確認密碼</Label>
            <Input
              id='confirmPassword'
              type='password'
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p
                className='text-sm text-destructive'
                data-testid='confirm-password-error'
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? '註冊中...' : '註冊'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
