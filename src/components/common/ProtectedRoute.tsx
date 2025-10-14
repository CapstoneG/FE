import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component để bảo vệ các route yêu cầu authentication
 * Nếu user chưa đăng nhập, sẽ chuyển hướng về trang login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Hiển thị loading trong khi check authentication
  if (isLoading) {
    return <Loading />;
  }

  // Nếu user chưa authenticated, chuyển hướng đến trang login
  // Lưu lại đường dẫn hiện tại để sau khi đăng nhập có thể quay lại
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Nếu đã authenticated, hiển thị nội dung được bảo vệ
  return <>{children}</>;
};