import React from 'react';
import { Header } from '../components/layout/Header';
import { AuthProvider } from '../components';

const HeaderDemo: React.FC = () => {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        
        {/* Demo content */}
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            Header Component Demo
          </h1>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>
              Tính năng Header
            </h2>
            
            <ul style={{ lineHeight: '1.8', color: '#6b7280' }}>
              <li>✅ Logo + Brand name với slogan</li>
              <li>✅ Menu navigation với dropdown (Courses, Skills)</li>
              <li>✅ Search bar với icon tìm kiếm</li>
              <li>✅ Login/Register buttons</li>
              <li>✅ User dropdown khi đã đăng nhập (Profile, Dashboard, Logout)</li>
              <li>✅ CTA button "Bắt đầu học miễn phí"</li>
              <li>✅ Responsive design với hamburger menu trên mobile</li>
              <li>✅ Modern design với animations và hover effects</li>
            </ul>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>
              Hướng dẫn sử dụng
            </h2>
            
            <div style={{ lineHeight: '1.8', color: '#6b7280' }}>
              <p><strong>1. Import Header component:</strong></p>
              <pre style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '4px', 
                overflow: 'auto',
                margin: '0.5rem 0 1rem 0',
                fontSize: '0.9rem'
              }}>
{`import { Header } from './components/layout/Header';`}
              </pre>
              
              <p><strong>2. Sử dụng trong component:</strong></p>
              <pre style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '4px', 
                overflow: 'auto',
                margin: '0.5rem 0 1rem 0',
                fontSize: '0.9rem'
              }}>
{`<Header className="custom-header" />`}
              </pre>
              
              <p><strong>3. Responsive:</strong></p>
              <p>Header tự động thích ứng với các kích thước màn hình:</p>
              <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                <li>Desktop: Full menu với tất cả tính năng</li>
                <li>Tablet: Thu gọn search bar</li>
                <li>Mobile: Hamburger menu với overlay</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default HeaderDemo;