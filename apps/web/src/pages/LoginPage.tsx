import { useEffect, type FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { LoginForm } from '@axiom/ui/blocks/LoginForm'; // 導入 LoginForm
import { type LoginUserDto } from '@axiom/types'; // 保持 LoginUserDto 導入

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

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
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoggingIn}
        error={loginError?.message}
      />
      <div className='absolute bottom-8 text-sm text-center text-gray-600'>
        還沒有帳號？{' '}
        <Link
          to='/register'
          className='font-medium text-blue-600 hover:underline'
        >
          註冊
        </Link>
      </div>
    </div>
  );
};
