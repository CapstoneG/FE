import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../common/Loading';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component để redirect người dùng đã authenticated khỏi login/register pages
 * Nếu user đã có token, sẽ redirect về home hoặc redirectTo path
 */
export const AuthRedirect: React.FC<AuthRedirectProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    // Đánh dấu initial load hoàn tất
    if (!isLoading) {
      setInitialLoadDone(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Chỉ redirect nếu đã qua initial load và user authenticated
    if (initialLoadDone && isAuthenticated && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [initialLoadDone, isAuthenticated, isLoading, navigate, redirectTo]);

  // Hiển thị loading CHỈ trong lần đầu check auth
  if (!initialLoadDone && isLoading) {
    return <Loading />;
  }

  // Luôn render children để không unmount form khi login fail
  return <>{children}</>;
};