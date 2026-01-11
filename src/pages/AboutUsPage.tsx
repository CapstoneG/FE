import React from 'react';
import './AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-page">

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="section-container">
          <div className="section-content">
            <div className="section-text">
              <h2 className="section-title">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="section-description">
                ENGLISHHUB được thành lập với sứ mệnh làm cho việc học tiếng Anh trở nên dễ dàng, 
                hiệu quả và thú vị hơn bao giờ hết. Chúng tôi tin rằng mọi người đều có khả năng 
                thành thạo tiếng Anh khi được trang bị đúng phương pháp và công cụ phù hợp.
              </p>
              <p className="section-description">
                Với công nghệ AI tiên tiến và đội ngũ giáo viên giàu kinh nghiệm, chúng tôi mang 
                đến trải nghiệm học tập cá nhân hóa, giúp bạn đạt được mục tiêu ngôn ngữ của mình 
                một cách nhanh chóng và bền vững.
              </p>
            </div>
            <div className="section-image">
              <div className="image-placeholder mission-image">
                <img src="https://i.pinimg.com/736x/39/2e/c0/392ec05e477d8a53c46b697e5d42f965.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="section-container">
          <h2 className="section-title centered">Giá Trị Cốt Lõi</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#4F46E5" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="value-title">Chất Lượng</h3>
              <p className="value-description">
                Cam kết mang đến nội dung học tập chất lượng cao, được biên soạn bởi các chuyên gia hàng đầu
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#4F46E5" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="value-title">Đổi Mới</h3>
              <p className="value-description">
                Không ngừng cập nhật công nghệ và phương pháp giảng dạy tiên tiến nhất
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#4F46E5" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 className="value-title">Cộng Đồng</h3>
              <p className="value-description">
                Xây dựng cộng đồng học tập tích cực, nơi mọi người cùng nhau phát triển
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path stroke="#4F46E5" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="value-title">Hiệu Quả</h3>
              <p className="value-description">
                Tối ưu hóa thời gian học tập, giúp bạn đạt kết quả nhanh nhất có thể
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section story-section">
        <div className="section-container">
          <div className="section-content reverse">
            <div className="section-image">
              <div className="image-placeholder story-image">
                <svg width="200" height="200" fill="none" viewBox="0 0 24 24">
                  <path fill="#4F46E5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
                </svg>
              </div>
            </div>
            <div className="section-text">
              <h2 className="section-title">Câu Chuyện Của Chúng Tôi</h2>
              <p className="section-description">
                ENGLISHHUB được thành lập vào năm 2025, xuất phát từ nhận thức về những khó khăn 
                mà người Việt Nam gặp phải khi học tiếng Anh theo phương pháp truyền thống.
              </p>
              <p className="section-description">
                Chúng tôi đã nghiên cứu và phát triển một nền tảng học tập kết hợp giữa công nghệ 
                AI tiên tiến và phương pháp giảng dạy hiện đại, giúp người học tiến bộ nhanh chóng 
                và duy trì động lực học tập lâu dài.
              </p>
              <p className="section-description">
                Sau 4 tháng phát triển, ENGLISHHUB đã trở thành một trong những nền tảng học tiếng 
                Anh trực tuyến hàng đầu tại Việt Nam, với hơn 100,000 học viên tin tưởng và lựa chọn.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default AboutUsPage;
