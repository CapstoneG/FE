import React from 'react';
import './HomePage.css';
import hero_img from '../assets/homepage.jpg';
import { Course, TestimonialCard, BlogCard } from '../components';
import { FaClone, FaChartLine } from 'react-icons/fa';
import { BiSolidVideos } from "react-icons/bi";
import { IoGameController } from "react-icons/io5";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Nâng cao tiếng Anh mỗi ngày cùng EngHub</h1>
          <p className="hero-description">
            Nền tảng học tập toàn diện giúp bạn rèn luyện tiếng Anh hiệu quả với phương pháp học tương tác, cá nhân hóa và theo dõi tiến trình rõ ràng.
          </p>
          <button className="hero-button">Bắt đầu ngay</button>
        </div>
        <div className="hero-image">
          <img src={hero_img} alt="EngHub Learning" />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="intro-header">
          <h2>Về EngHub</h2>
          <p>Đồng hành cùng bạn trên hành trình chinh phục tiếng Anh</p>
        </div>
        <div className="intro-content">
          <div className="intro-text">
            <p>
              EngHub là nền tảng học tiếng Anh hiện đại, được thiết kế để giúp người học ở mọi trình độ
              nhanh chóng cải thiện kỹ năng ngôn ngữ. Sứ mệnh của chúng tôi là xóa bỏ rào cản ngôn ngữ
              và tạo cơ hội bình đẳng thông qua việc tiếp cận giáo dục chất lượng cao.
            </p>
          </div>
          <div className="intro-image">
            <img src="https://i.pinimg.com/1200x/00/8c/81/008c81275f71b794ce9240e10dcc1d0e.jpg" alt="Giới thiệu EngHub" />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="courses-section">
        <div className="intro-header">
          <h2>Các khóa học nổi bật</h2>
          <p>Khám phá các khóa học được thiết kế phù hợp với mọi nhu cầu học tập của bạn</p>
        </div>
        <div className="course-cards">
          <Course 
            imageUrl="https://i.pinimg.com/736x/83/c6/cc/83c6cc616d6315d051b8c9f6399d5609.jpg"
            title="Luyện nghe - nói giao tiếp"
            description="Phát triển kỹ năng giao tiếp thực tế với người bản xứ qua các bài học tương tác"
            altText="Luyện nghe - nói giao tiếp"
          />
          <Course 
            imageUrl="https://i.pinimg.com/1200x/62/3b/41/623b4159fb4ee69d475810c500cf056e.jpg"
            title="Ngữ pháp cơ bản"
            description="Nắm vững nền tảng ngữ pháp tiếng Anh với các bài giảng dễ hiểu và bài tập thực hành"
            altText="Ngữ pháp cơ bản"
          />
          <Course 
            imageUrl="https://i.pinimg.com/1200x/00/9a/78/009a7884927a9b1664d78ce5833f778e.jpg"
            title="Từ vựng theo chủ đề"
            description="Mở rộng vốn từ vựng theo các chủ đề thiết thực với cuộc sống và công việc"
            altText="Từ vựng theo chủ đề"
          />
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section">
        <div className="intro-header">
          <h2>Tính năng nổi bật</h2>
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              {/* <FaVideo size={40} color="#2563eb" /> */}
              <BiSolidVideos size={34} color="#2563eb" />
            </div>
            <h3>Học qua video</h3>
            <p>Trải nghiệm học tập sinh động với video bài giảng chất lượng cao</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FaClone size={34} color="#2563eb" />
            </div>
            <h3>Flashcard từ vựng</h3>
            <p>Ghi nhớ từ vựng hiệu quả với hệ thống flashcard thông minh</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <IoGameController size={34} color="#2563eb" />
            </div>
            <h3>Trò chơi luyện tập</h3>
            <p>Học tập thú vị thông qua các game và quiz tương tác</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FaChartLine size={34} color="#2563eb" />
            </div>
            <h3>Theo dõi tiến trình</h3>
            <p>Dễ dàng theo dõi và đánh giá tiến độ học tập của bạn</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="intro-header">
          <h2>Phản hồi từ học viên</h2>
        </div>
        <div className="testimonials-container">
          <TestimonialCard
            avatarUrl="https://i.pinimg.com/originals/48/ac/18/48ac183471588768c4b26b44a747f34a.jpg"
            name="Trần Hương Giang"
            rating="★★★★★"
            testimonial="Tôi đã cải thiện kỹ năng giao tiếp tiếng Anh đáng kể sau 3 tháng học tại EngHub. Các bài giảng rất thực tế và dễ hiểu."
          />
          <TestimonialCard
            avatarUrl="https://icdn.dantri.com.vn/thumb_w/960/2019/06/25/chang-trai-bac-lieu-dep-trai-nhu-tai-tudocx-1561438179930.jpeg"
            name="Lê Quang Thắng"
            rating="★★★★☆"
            testimonial="Phương pháp học tương tác giúp tôi không còn cảm thấy nhàm chán khi học tiếng Anh. Các trò chơi và bài tập rất thú vị."
          />
          <TestimonialCard
            avatarUrl="https://bizweb.dktcdn.net/100/303/962/files/87126502-2509242206005371-2073523065622364160-n-f697e400-e8b2-4bb1-9698-d00b50b2d9c3.jpg?v=1627804121650"
            name="Nguyễn Thị Ngọc Mai"
            rating="★★★★★"
            testimonial="Sau khóa học từ vựng theo chủ đề, tôi tự tin hơn rất nhiều khi sử dụng tiếng Anh trong công việc hàng ngày."
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="intro-header">
          <h2>Mẹo học tiếng Anh</h2>
          <p>Khám phá các bài viết hữu ích giúp việc học tiếng Anh hiệu quả hơn</p>
        </div>
        <div className="blog-posts">
          <BlogCard
            imageUrl="https://i.pinimg.com/1200x/a6/bf/5e/a6bf5e4badab37aa440ef92e29dda1b8.jpg"
            title="5 bí quyết học từ vựng hiệu quả"
            description="Tìm hiểu các phương pháp giúp ghi nhớ từ vựng lâu dài và ứng dụng ngay vào thực tế."
            altText="5 bí quyết học từ vựng hiệu quả"
          />
          <BlogCard
            imageUrl="https://i.pinimg.com/1200x/80/82/0b/80820b0faec9dc7574c5a77fbf2f2e6b.jpg"
            title="Luyện nghe tiếng Anh mỗi ngày"
            description="Hướng dẫn cách luyện kỹ năng nghe hiệu quả với các nguồn tài liệu miễn phí."
            altText="Luyện nghe tiếng Anh mỗi ngày"
          />
          <BlogCard
            imageUrl="https://i.pinimg.com/736x/79/8f/05/798f0598670fd9fd01143fc73027eaac.jpg"
            title="Cách vượt qua rào cản tâm lý khi nói tiếng Anh"
            description="Những chiến lược giúp bạn tự tin giao tiếp bằng tiếng Anh trong mọi tình huống."
            altText="Cách vượt qua rào cản tâm lý khi nói tiếng Anh"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;