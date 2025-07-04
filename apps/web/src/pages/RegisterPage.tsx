import { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@ui/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { RegisterFormData, RegisterFormSchema } from '@axiom/types';

export function RegisterPage() {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const {
    mutateAsync: registerUser,
    isPending: isRegistering,
    error: registerError,
  } = useRegister();

  useEffect(() => {
    if (auth) {
      navigate('/profile', { replace: true });
    }
  }, [auth, navigate]);

  const onSubmit = (data: RegisterFormData) => {
    // 直接呼叫 registerUser。react-query 的 useMutation 會自動處理 promise 的狀態。
    // 成功時，useRegister hook 內部會更新認證狀態，觸發 useEffect 導航。
    // 失敗時，錯誤會被 useRegister hook 捕捉並存放在 registerError state 中，然後在 UI 上顯示。
    registerUser(data).catch(error => {
      // 這個 .catch 是可選的，僅用於額外的日誌記錄或副作用，
      // 因為 UI 的錯誤顯示已經由 useRegister hook 的 error state 處理了。
      console.error('Registration failed:', error);
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Card className='w-full max-w-sm'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className='text-2xl'>註冊</CardTitle>
            <CardDescription>
              已經有帳戶了？{' '}
              <Link to='/login' className='underline'>
                登入
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>名稱</Label>
              <Input
                id='name'
                placeholder='Max Robinson'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-xs text-red-500'>{errors.name.message}</p>
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
                <p className='text-xs text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>密碼</Label>
              <Input id='password' type='password' {...register('password')} />
              {errors.password && (
                <p className='text-xs text-red-500'>
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
                  className='text-xs text-red-500'
                  data-testid='confirm-password-error'
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {registerError && (
              <p className='text-sm text-red-500'>{registerError.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isRegistering}>
              {isRegistering ? '處理中...' : '建立帳戶'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
