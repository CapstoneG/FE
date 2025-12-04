import React from 'react';
import './Footer.css';
import logoImg from '../../assets/logo.png';

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        {children || (
          <>
            <div className="footer-content">
              {/* About Section */}
              <div className="footer-section about-section">
                <div className="logo-container">
                  <img src={logoImg} alt="ENGLISHHUB Logo" className="logo-img" />
                  <h3 className="footer-title">ENGHUB</h3>
                </div>
                <p className="footer-description">
                  Nền tảng học tiếng Anh hiện đại và hiệu quả, giúp bạn thành thạo tiếng Anh một cách dễ dàng.
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </span>
                    <a href="mailto:englishhub@gmail.com" className="contact-link">englishhub@gmail.com</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </span>
                    <a href="tel:0987654321" className="contact-link">0987654321</a>
                  </div>
                </div>
              </div>
              
              {/* Courses Section */}
              <div className="footer-section">
                <h4 className="footer-heading">Khóa học</h4>
                <ul className="footer-links">
                  <li><a href="/courses/beginner" className="footer-link">Beginner</a></li>
                  <li><a href="/courses/intermediate" className="footer-link">Intermediate</a></li>
                  <li><a href="/courses/advanced" className="footer-link">Advanced</a></li>
                  <li><a href="/courses/business" className="footer-link">Business English</a></li>
                </ul>
              </div>
              
              {/* Skills Section */}
              <div className="footer-section">
                <h4 className="footer-heading">Kỹ năng</h4>
                <ul className="footer-links">
                  <li><a href="/skills/listening" className="footer-link">Listening</a></li>
                  <li><a href="/skills/speaking" className="footer-link">Speaking</a></li>
                  <li><a href="/skills/reading" className="footer-link">Reading</a></li>
                  <li><a href="/skills/writing" className="footer-link">Writing</a></li>
                </ul>
              </div>
              
              {/* Support Section */}
              <div className="footer-section">
                <h4 className="footer-heading">Hỗ trợ</h4>
                <ul className="footer-links">
                  <li><a href="/about" className="footer-link">Về chúng tôi</a></li>
                  <li><a href="/faq" className="footer-link">FAQs</a></li>
                  <li><a href="/how-it-works" className="footer-link">Hướng dẫn sử dụng</a></li>
                  <li><a href="/contact" className="footer-link">Liên hệ</a></li>
                </ul>
              </div>
              
              {/* Newsletter Section */}
              <div className="footer-section newsletter-section">
                <h4 className="footer-heading">Đăng ký nhận tin</h4>
                <p className="newsletter-description">
                  Nhận thông tin mới nhất về khóa học và tips học tiếng Anh
                </p>
                <form className="newsletter-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Nhập email của bạn"
                      className="newsletter-input"
                      required
                    />
                    <button type="submit" className="newsletter-btn">
                      Subscribe
                    </button>
                  </div>
                </form>
                
                {/* Social Media */}
                <div className="social-media">
                  <span className="social-label">Theo dõi chúng tôi:</span>
                  <div className="footer-social">
                    <a href="#" className="social-icon" aria-label="Facebook">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="social-icon" aria-label="Instagram">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="social-icon" aria-label="GitHub">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <p className="footer-copyright">
                  © 2025 ENGLISHHUB. All Rights Reserved.
                </p>
                <div className="footer-legal">
                  <a href="/terms" className="footer-legal-link">Terms of Use</a>
                  <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
                  <a href="/refund" className="footer-legal-link">Refund Policy</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
};

interface FooterSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`footer-section ${className}`}>
      {title && <h4 className="footer-heading">{title}</h4>}
      {children}
    </div>
  );
};

interface FooterLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({ links, className = '' }) => {
  return (
    <ul className={`footer-links ${className}`}>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="footer-link">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};