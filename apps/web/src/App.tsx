import './styles/globals.css';

// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <HomePage />,
//   },
//   {
//     path: '/login',
//     element: <LoginPage />,
//   },
//   {
//     path: '/register',
//     element: <RegisterPage />,
//   },
//   {
//     path: '/profile',
//     element: <ProfilePage />,
//   },
// ]);

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      {/* <Route path="/profile" element={<ProfilePage />} /> */}

      {/* 所有巢狀在此 Route 下的路由都將受到保護 */}
      <Route element={<ProtectedRoute />}>
        <Route path='/profile' element={<ProfilePage />} />
        {/* 未來其他需要保護的路由可以放在這裡，例如 /dashboard, /settings */}
      </Route>
    </Routes>
  );
}
