import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/auth/RegisterPage.css';
import '@/styles/auth/RegisterSuccessPopup.css'
import '@/styles/auth/OAuthLoading.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      // Show success popup instead of immediate redirect
      setRegisteredEmail(formData.email);
      setShowSuccessPopup(true);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="oauth-loading-overlay">
          <div className="success-popup">
            <div className="success-icon">✉️</div>
            <h2>Registration Successful!</h2>
            <p className="success-message">
              We've sent a verification email to:
            </p>
            <p className="email-highlight">{registeredEmail}</p>
            <button 
              className="goto-login-btn"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

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

      <div className="register-container">
        <div className="register-card">
          {/* Left Side - Illustration */}
          <div className="register-illustration">
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
                <p className="subtitle">Start your English learning journey with our advanced platform</p>
                
                <div className="features-highlight">
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>Interactive Learning Experience</span>
                  </div>
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>Real-time Progress Tracking</span>
                  </div>
                  <div className="feature-point">
                    <div className="feature-dot"></div>
                    <span>AI-Powered Practice Sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="register-form-section">
            <div className="form-header">
              <h1 className="form-title">Create Account</h1>
              <p className="form-description">Fill in your information to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {error && (
                <div className="error-message" style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <div className="form-row form-row-split">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

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
                    disabled={isSubmitting}
                  />
                </div>
              </div>



              <div className="form-row form-row-split">
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
                    disabled={isSubmitting}
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="register-button"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="form-footer">
              <p className="login-link">
                Already have an account? <a href="/login" className="link">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;