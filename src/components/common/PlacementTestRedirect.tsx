import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PlacementTestRedirectProps {
  children: React.ReactNode;
}

/**
 * PlacementTestRedirect Component
 * 
 * This component checks if an authenticated user has completed their placement test.
 * If the user's level is null, they will be redirected to the placement test page.
 * 
 * Usage:
 * Wrap routes that should check for placement test completion
 */
const PlacementTestRedirect: React.FC<PlacementTestRedirectProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip check while still loading or already on placement test page
    if (isLoading || location.pathname === '/placement-test') {
      return;
    }

    // If user is authenticated and level is null, redirect to placement test
    if (user && user.level === null) {
      console.log('User has no level assigned. Redirecting to placement test...');
      navigate('/placement-test', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [user, isLoading, navigate, location]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Render children if user has a level or is not authenticated
  return <>{children}</>;
};

export default PlacementTestRedirect;
