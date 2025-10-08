import React, { useState } from 'react';
import { SiGithub } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      
      // Login successful - redirect to home
      console.log('Login successful');
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="login-page">
      {/* Background patterns */}
      <div className="background-pattern">
        <div className="pattern-item pattern-1">📚</div>
        <div className="pattern-item pattern-2">✏️</div>
        <div className="pattern-item pattern-3">📝</div>
        <div className="pattern-item pattern-4">🎓</div>
        <div className="pattern-item pattern-5">💡</div>
        <div className="pattern-item pattern-6">🌟</div>
        <div className="pattern-item pattern-7">🚀</div>
        <div className="pattern-item pattern-8">📖</div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Left Side - Illustration */}
          <div className="login-illustration">
            <div className="illustration-content">
              <div className="logo-section">
                <div className="logo-container">
                  <img src="/src/assets/logo.png" alt="Enghub Logo" className="logo-img" />
                  <h2 className="brand-name">Enghub</h2>
                </div>
              </div>
              
              <div className="learning-icons">
                <div className="icon-stack">
                  <div className="learning-book">
                    <div className="book-page"></div>
                    <div className="book-cover"></div>
                  </div>
                  <div className="floating-letters">
                    <span className="letter letter-a">A</span>
                    <span className="letter letter-b">B</span>
                    <span className="letter letter-c">C</span>
                  </div>
                  <div className="pencil">
                    <div className="pencil-body"></div>
                    <div className="pencil-tip"></div>
                  </div>
                </div>
              </div>
              
              <div className="illustration-text">
                <p className="subtitle">Welcome back to your English learning journey</p>
                
                <div className="features-highlight">
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>Continue Your Progress</span>
                  </div>
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>Access Your Courses</span>
                  </div>
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>Track Your Achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
            <div className="form-header">
              <h1 className="form-title">Welcome Back</h1>
              <p className="form-description">Sign in to your account to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="form-footer">
              <p className="register-link">
                Don't have an account? <a href="/register" className="link">Sign up</a>
              </p>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google-btn"
                  onClick={() => handleSocialLogin('google')}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75 4.8 4.8 0 0 1-4.52-3.36H1.83v2.07A8.1 8.1 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.46 10.41a5.07 5.07 0 0 1 0-2.82V5.52H1.83a8.1 8.1 0 0 0 0 6.96l2.63-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8.15 8.15 0 0 0 8.98 1a8.1 8.1 0 0 0-7.15 4.52l2.63 2.07c.61-1.8 2.48-3.41 4.52-3.41z"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="social-btn github-btn"
                  onClick={() => handleSocialLogin('github')}
                >
                  <SiGithub size={18} color="#181717" />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
