import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { RegisterForm } from '@axiom/ui/blocks/RegisterForm'; // 導入 RegisterForm
import { RegisterFormData } from '@axiom/types'; // 保持 RegisterFormData 導入

export function RegisterPage() {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

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
    registerUser(data).catch(error => {
      console.error('Registration failed:', error);
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <RegisterForm
        onSubmit={onSubmit}
        isLoading={isRegistering}
        error={registerError?.message}
      />
      <div className='absolute bottom-8 text-sm text-center text-gray-600'>
        已經有帳戶了？{' '}
        <Link to='/login' className='font-medium text-blue-600 hover:underline'>
          登入
        </Link>
      </div>
    </div>
  );
}
