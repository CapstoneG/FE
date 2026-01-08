import React from 'react';
import { Footer } from './Footer';
import { ChatBot } from '../common/ChatBot';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = '' 
}) => {
  return (
    <div className={`layout ${className}`}>
      {showHeader && (
        <header className="layout-header">
          {/* Header will be imported separately */}
        </header>
      )}
      
      <main className="main-content">
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Chat Widget */}
      <ChatBot />
    </div>
  );
};

interface MainProps {
  children: React.ReactNode;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ children, className = '' }) => {
  return (
    <main className={`main ${className}`}>
      {children}
    </main>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`auth-layout ${className}`}>
      <div className="auth-container">
        <div className="auth-header">
          <h1>ENGHUB</h1>
        </div>
        
        <div className="auth-content">
          {children}
        </div>
        
        <div className="auth-footer">
          <p>&copy; 2025 ENGLISHHUB. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};