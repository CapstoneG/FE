import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Nếu user đã authenticated và không đang loading, redirect về home
    if (isAuthenticated && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  // Hiển thị loading trong khi check authentication
  if (isLoading) {
    return <Loading />;
  }

  // Nếu user chưa authenticated, hiển thị children (login/register form)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Nếu đã authenticated, không hiển thị gì (đang redirect)
  return null;
};