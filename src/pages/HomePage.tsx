import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Chào mừng đến với ENGLISHHUB</h1>
      <p>Nền tảng học tiếng Anh hiện đại và hiệu quả.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Tính năng nổi bật</h2>
        <ul>
          <li>Bài học tương tác</li>
          <li>Theo dõi tiến độ</li>
          <li>Cộng đồng học tập</li>
          <li>Luyện tập từ vựng</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem', minHeight: '400px' }}>
        <h2>Nội dung demo</h2>
        <p>Đây là nội dung demo để kiểm tra Footer hiển thị đúng ở cuối trang.</p>
      </div>
    </div>
  );
};

export default HomePage;