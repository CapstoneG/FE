import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <div className="contact-page">

      {/* Contact Content */}
      <section className="contact-content-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2 className="contact-info-title">Thông Tin Liên Hệ</h2>
              <p className="contact-info-description">
                Hãy liên hệ với chúng tôi qua bất kỳ kênh nào dưới đây. 
                Chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </p>

              <div className="contact-info-items">
                <div className="contact-info-item">
                  <h3 className="info-label">Địa chỉ</h3>
                  <p className="info-value">Số 96A Trần Phú, phường Hà Đông, Hà Nội</p>
                </div>

                <div className="contact-info-item">
                  <h3 className="info-label">Điện thoại</h3>
                  <p className="info-value">+84 338 286 422</p>
                  <p className="info-value">+84 123 456 789</p>
                </div>

                <div className="contact-info-item">
                  <h3 className="info-label">Email</h3>
                  <p className="info-value">support@englishhub.com</p>
                  <p className="info-value">info@englishhub.com</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="contact-social">
                <h3 className="info-label">Kết nối với chúng tôi</h3>
                <div className="contact-social-icons">
                  <a href="#" className="social-icon-link facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon-link instagram">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2 className="contact-form-title">Gửi Tin Nhắn</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Nhập họ tên của bạn"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0987654321"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Chủ đề
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="general">Thông tin chung</option>
                    <option value="course">Khóa học</option>
                    <option value="technical">Hỗ trợ kỹ thuật</option>
                    <option value="payment">Thanh toán</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Nội dung <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows={6}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-btn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="contact-container">
          <h2 className="faq-title">Câu Hỏi Thường Gặp</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Có chức năng theo dõi tiến độ học không?</h3>
              <p className="faq-answer">
                Có, hệ thống của chúng tôi có chức năng theo dõi tiến độ học tập chi tiết. Bạn có thể xem được phần trăm hoàn thành khóa học, điểm số các bài kiểm tra và thống kê thời gian học tập.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Nội dung bài học có bao gồm cả nghe, nói, đọc, viết không?</h3>
              <p className="faq-answer">
                Có, tất cả khóa học đều được thiết kế để phát triển đầy đủ 4 kỹ năng: Listening (Nghe), Speaking (Nói), Reading (Đọc) và Writing (Viết) một cách cân bằng và hiệu quả.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Website có những loại khóa học nào?</h3>
              <p className="faq-answer">
                Chúng tôi cung cấp các khóa học từ Beginner (Sơ cấp), Intermediate (Trung cấp), Advanced (Nâng cao) đến Business English (Tiếng Anh thương mại), phù hợp với mọi trình độ.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Có cần trả phí để học không?</h3>
              <p className="faq-answer">
                Chúng tôi có cả khóa học miễn phí và khóa học trả phí. Các khóa học cơ bản hoàn toàn miễn phí, còn các khóa học chuyên sâu và nâng cao sẽ có mức phí hợp lý.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
