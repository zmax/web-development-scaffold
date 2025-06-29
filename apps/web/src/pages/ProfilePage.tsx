import { useAuthStore } from '@/stores';
import { Button } from '@ui/index';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogout } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useLogout();
  const navigate = useNavigate();

  // 這是一個簡單的路由守衛，如果未登入，則導向登入頁
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated || !user) {
    // 在 useEffect 重新導向之前，可以顯示載入中或直接返回 null
    return null;
  }

  return (
    <div className='p-4 md:p-8'>
      <h1 className='text-2xl font-bold mb-4'>個人資料</h1>
      <div className='space-y-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-md'>
        <p>
          <strong>名稱:</strong> {user.name}
        </p>
        <p>
          <strong>電子郵件:</strong> {user.email}
        </p>
      </div>
      <Button onClick={handleLogout} className='mt-4'>
        登出
      </Button>
    </div>
  );
};
