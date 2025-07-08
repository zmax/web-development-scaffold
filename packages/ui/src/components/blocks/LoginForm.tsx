import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginUserSchema, LoginUserDto } from '@axiom/types/api';
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

interface LoginFormProps {
  onSubmit: (data: LoginUserDto) => void;
  isLoading: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserSchema),
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>登入</CardTitle>
        <CardDescription>輸入您的電子郵件和密碼以登入。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? '登入中...' : '登入'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
