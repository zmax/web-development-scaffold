import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * 受保護的路由元件。
 * 在渲染子路由之前，檢查使用者是否已登入。
 * 如果未登入，則導向至登入頁面。
 */
export const ProtectedRoute = () => {
  const { auth } = useAuthStore();
  const location = useLocation();

  if (!auth) {
    // 使用者未登入，導向登入頁。
    // `replace` 屬性可避免使用者透過瀏覽器的「返回」按鈕回到受保護的頁面。
    // `state` 屬性可以將當前位置傳遞給登入頁，以便在登入成功後返回。
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // 使用者已登入，渲染巢狀的子路由。
  return <Outlet />;
};
