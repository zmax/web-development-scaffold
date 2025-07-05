import { useAuthStore } from '@/stores/authStore';
import { Button } from '@axiom/ui';
import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
import { useLogout } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { auth } = useAuthStore();
  const logout = useLogout();
  const navigate = useNavigate();

  // const isAuthenticated = !!auth;
  // 路由守衛邏輯已移至 ProtectedRoute，這裡可以安全地假設 auth 和 user 必定存在
  const user = auth?.user;

  const handleLogout = () => {
    logout();
    // 雖然 ProtectedRoute 會自動處理導向，但立即導航可以提供更快的反饋
    navigate('/login');
  };

  if (!user) {
    // 雖然理論上不會發生，但作為防禦性程式碼，可以在此返回 null 或 loading 狀態
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
