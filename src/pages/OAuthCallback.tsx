import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code from URL parameters
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setError('No authentication code received');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for token and get user info
        await authService.handleOAuthCallback(code);
        
        // Redirect to home page after successful login (force reload to update auth context)
        window.location.href = '/';
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      {error ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#fee' }}>Authentication Failed</h2>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Redirecting to login page...</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ marginBottom: '0.5rem' }}>Completing Sign In...</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Please wait while we authenticate you</p>
        </div>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OAuthCallback;
