import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useLogin } from '@/hooks/useAuth';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@ui/index';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    mutateAsync: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useLogin();

  // 如果已經登入，直接導向個人資料頁
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password });
      navigate('/profile', { replace: true });
    } catch (error) {
      // 錯誤將由 loginError state 處理，這裡���以留空或做額外日誌記錄
      console.error('登入失敗:', error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>登入</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>電子郵件</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>密碼</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            {loginError && (
              <p className='text-sm text-red-500'>{loginError.message}</p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
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
