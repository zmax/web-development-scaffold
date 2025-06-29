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
import { RegisterInput, RegisterSchema, useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const { registerUser, isRegistering, registerError } = useRegister();

  const onSubmit = async (data: RegisterInput) => {
    try {
      const authResponse = await registerUser(data);
      if (authResponse) {
        setAuth(authResponse.user, authResponse.token);
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      // 錯誤將由 registerError state 處理，這裡可以留空或做額外日誌記錄
      console.error('註冊失敗:', error);
    }
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
                error={!!errors.name}
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
                error={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className='text-xs text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>密碼</Label>
              <Input
                id='password'
                type='password'
                error={!!errors.password}
                {...register('password')}
              />
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
                error={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-xs text-red-500'>
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
