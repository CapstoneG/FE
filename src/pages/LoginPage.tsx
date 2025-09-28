import React from 'react';
import { AuthLayout } from '../components';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Đăng nhập</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                marginTop: '0.25rem'
              }} 
            />
          </div>
          
          <div>
            <label htmlFor="password">Mật khẩu:</label>
            <input 
              type="password" 
              id="password" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                marginTop: '0.25rem'
              }} 
            />
          </div>
          
          <button 
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;