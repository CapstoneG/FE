import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AuthRedirect, ProtectedRoute } from '../components';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import BeginnerPage from '../pages/BeginnerPage';
import IntermediatePage from '../pages/IntermediatePage';
import AdvancedPage from '../pages/AdvancedPage';
import BusinessPage from '../pages/BusinessPage';

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
      <Route path="/courses/beginner" element={
        <Layout>
          <BeginnerPage />
        </Layout>
      } />
      <Route path="/courses/intermediate" element={
        <Layout>
          <IntermediatePage />
        </Layout>
      } />
      <Route path="/courses/advanced" element={
        <Layout>
          <AdvancedPage />
        </Layout>
      } />
      <Route path="/courses/business" element={
        <Layout>
          <BusinessPage />
        </Layout>
      } />
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