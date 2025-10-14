import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AuthRedirect, ProtectedRoute } from '../components';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible without login */}
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
      <Route path="/register" element={
          <RegisterPage />
      } />
      
      {/* Protected Routes - Require authentication */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;