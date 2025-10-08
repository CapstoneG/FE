import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AuthRedirect } from '../components';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={
        <AuthRedirect>
          <LoginPage />
        </AuthRedirect>
      } />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;