import { useEffect, type FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@axiom/ui';
import { LoginUserSchema, type LoginUserDto } from '@axiom/types';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserSchema),
  });

  const {
    mutateAsync: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useLogin();

  useEffect(() => {
    if (auth) {
      navigate('/profile');
    }
  }, [auth, navigate]);

  const onSubmit = async (data: LoginUserDto) => {
    try {
      await login(data);
      // 成功後 useLogin hook 會處理 setAuth，並觸發上面的 useEffect 進行導航
    } catch (error) {
      // 錯誤將由 loginError state 處理，這裡可以留空或做額外日誌記錄
      console.error('登入失敗:', error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>登入</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='grid gap-4'>
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
            {loginError && (
              <p className='text-sm text-red-500'>{loginError.message}</p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col items-center gap-4'>
            <Button type='submit' className='w-full' disabled={isLoggingIn}>
              {isLoggingIn ? '登入中...' : '登入'}
            </Button>
            <p className='text-sm text-center text-gray-600'>
              還沒有帳號？{' '}
              <Link
                to='/register'
                className='font-medium text-blue-600 hover:underline'
              >
                註冊
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
