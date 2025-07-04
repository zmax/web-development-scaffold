import { useAuthStore } from '@/stores/authStore';
import { Button } from '@ui/index';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { auth } = useAuthStore();
  const isAuthenticated = !!auth;
  const user = auth?.user;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-4'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to Web Scaffold</h1>
      {isAuthenticated && user ? (
        <div>
          <p className='text-xl mb-4'>你好, {user.name}!</p>
          <Link to='/profile'>
            <Button>查看個人資料</Button>
          </Link>
        </div>
      ) : (
        <div>
          <p className='text-xl mb-4'>請登入以繼續，或註冊新帳戶。</p>
          <div className='space-x-4'>
            <Link to='/login'>
              <Button>登入</Button>
            </Link>
            <Link to='/register'>
              <Button variant='outline'>註冊</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
