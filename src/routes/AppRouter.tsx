import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AuthRedirect, ProtectedRoute, PlacementTestRedirect } from '@/components';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import BeginnerPage from '@/pages/courses/BeginnerPage';
import IntermediatePage from '@/pages/courses/IntermediatePage';
import AdvancedPage from '@/pages/courses/AdvancedPage';
import BusinessPage from '@/pages/courses/BusinessPage';
// import ListeningPage from '@/pages/lesson/ListeningPage';
import ListeningPage from '@/pages/ListeningPage';
// import SpeakingPage from '@/pages/lesson/SpeakingPage';
import SpeakingPage from '@/pages/SpeakingPage';
// import ReadingPage from '@/pages/lesson/ReadingPage';
import ReadingPage from '@/pages/ReadingPage';
// import WritingPage from '@/pages/lesson/WritingPage';
import WritingPage from '@/pages/WritingPage';
import PlacementTestPage from '@/pages/PlacementTestPage';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactPage from '@/pages/ContactPage';
import SpeakingTrainingPage from '@/pages/SpeakingTrainingPage';
import SpeakingPracticePage from '@/pages/SpeakingPracticePage';
import DashboardPage from '@/pages/DashboardPage';
import FlashcardDeckList from '@/pages/flashcards/FlashcardDeckList';
import FlashcardLesson from '@/pages/flashcards/FlashcardLesson';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible without login */}
      <Route path="/" element={
        <PlacementTestRedirect>
          <Layout>
            <HomePage />
          </Layout>
        </PlacementTestRedirect>
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
      <Route path="/about" element={
        <Layout>
          <AboutUsPage />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout>
          <ContactPage />
        </Layout>
      } />
      <Route path="/speaking-training" element={
        <Layout>
          <SpeakingTrainingPage />
        </Layout>
      } />
      <Route path="/speaking-training/practice" element={
        <SpeakingPracticePage />
      } />
      <Route path="/flashcard" element={
        <FlashcardDeckList />
      } />
      {/* <Route path="/flashcard/study/:deckId" element={
        <FlashcardStudy />
      } /> */}
      <Route path="/flashcard/lesson/:deckId" element={
        <FlashcardLesson />
      } />
      <Route path="/skills/listening" element={
        <Layout>
          <ListeningPage />
        </Layout>
      } />
      <Route path="/skills/speaking" element={
        <Layout>
          <SpeakingPage />
        </Layout>
      } />
      <Route path="/skills/reading" element={
        <Layout>
          <ReadingPage />
        </Layout>
      } />
      <Route path="/skills/writing" element={
        <Layout>
          <WritingPage />
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
      
      {/* Placement Test Route - Can be accessed without login */}
      <Route path="/placement-test" element={
        <PlacementTestPage />
      } />
      
      {/* Protected Routes - Require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
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