import React, { useState } from 'react';
import './BeginnerPage.css';
import { FaBook, FaHeadphones, FaPencilAlt, FaComments, FaStar, FaClock, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';
import begginer from '../assets/beginner.jpg';
import { OverviewCard } from '../components';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'exercise' | 'quiz';
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: React.ReactNode;
  progress: number;
}

const BeginnerPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const modules: Module[] = [
    {
      id: 1,
      title: "Bảng chữ cái & Phát âm",
      description: "Học 26 chữ cái tiếng Anh và cách phát âm chuẩn",
      icon: <FaBook size={32} />,
      progress: 75,
      lessons: [
        { id: 1, title: "Giới thiệu bảng chữ cái A-G", duration: "10 phút", completed: true, type: "video" },
        { id: 2, title: "Thực hành phát âm A-G", duration: "15 phút", completed: true, type: "exercise" },
        { id: 3, title: "Bảng chữ cái H-N", duration: "10 phút", completed: true, type: "video" },
        { id: 4, title: "Thực hành phát âm H-N", duration: "15 phút", completed: false, type: "exercise" },
        { id: 5, title: "Bảng chữ cái O-Z", duration: "10 phút", completed: false, type: "video" },
        { id: 6, title: "Kiểm tra tổng hợp", duration: "20 phút", completed: false, type: "quiz" },
      ]
    },
    {
      id: 2,
      title: "Từ vựng cơ bản",
      description: "200+ từ vựng thiết yếu cho người mới bắt đầu",
      icon: <FaPencilAlt size={32} />,
      progress: 45,
      lessons: [
        { id: 1, title: "Số đếm 1-100", duration: "12 phút", completed: true, type: "video" },
        { id: 2, title: "Luyện tập số đếm", duration: "10 phút", completed: true, type: "exercise" },
        { id: 3, title: "Màu sắc", duration: "8 phút", completed: true, type: "video" },
        { id: 4, title: "Thành viên gia đình", duration: "15 phút", completed: false, type: "video" },
        { id: 5, title: "Đồ vật xung quanh", duration: "12 phút", completed: false, type: "video" },
        { id: 6, title: "Kiểm tra từ vựng", duration: "15 phút", completed: false, type: "quiz" },
      ]
    },
    {
      id: 3,
      title: "Ngữ pháp căn bản",
      description: "Các cấu trúc câu đơn giản và thì hiện tại đơn",
      icon: <FaComments size={32} />,
      progress: 30,
      lessons: [
        { id: 1, title: "Cấu trúc câu cơ bản", duration: "15 phút", completed: true, type: "video" },
        { id: 2, title: "Động từ TO BE", duration: "12 phút", completed: true, type: "video" },
        { id: 3, title: "Bài tập TO BE", duration: "20 phút", completed: false, type: "exercise" },
        { id: 4, title: "Thì hiện tại đơn", duration: "18 phút", completed: false, type: "video" },
        { id: 5, title: "Luyện tập hiện tại đơn", duration: "25 phút", completed: false, type: "exercise" },
      ]
    },
    {
      id: 4,
      title: "Giao tiếp hàng ngày",
      description: "Các câu giao tiếp thông dụng trong cuộc sống",
      icon: <FaHeadphones size={32} />,
      progress: 0,
      lessons: [
        { id: 1, title: "Chào hỏi và giới thiệu", duration: "10 phút", completed: false, type: "video" },
        { id: 2, title: "Hỏi về thông tin cá nhân", duration: "12 phút", completed: false, type: "video" },
        { id: 3, title: "Thực hành hội thoại", duration: "15 phút", completed: false, type: "exercise" },
        { id: 4, title: "Mua sắm cơ bản", duration: "14 phút", completed: false, type: "video" },
        { id: 5, title: "Hỏi đường", duration: "10 phút", completed: false, type: "video" },
      ]
    }
  ];

  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const getLessonIcon = (type: string) => {
    switch(type) {
      case 'video': return <FaPlay size={16} />;
      case 'exercise': return <FaPencilAlt size={16} />;
      case 'quiz': return <MdQuiz size={16} />;
      default: return <FaBook size={16} />;
    }
  };

  return (
    <div className="beginner-page">
      {/* Hero Section */}
      <section className="beginner-hero">
        <div className="beginner-hero-content">
          <h1 className="beginner-hero-title">
            <span className="highlight">Khóa học Beginner</span>
          </h1>
          <p className="beginner-hero-subtitle">
            Bắt đầu hành trình chinh phục tiếng Anh từ con số 0
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <FaBook size={24} color="#2563eb" />
              <div>
                <h3>4 Modules</h3>
                <p>Học từ cơ bản</p>
              </div>
            </div>
            <div className="stat-item">
              <FaClock size={24} color="#2563eb" />
              <div>
                <h3>20+ Giờ</h3>
                <p>Nội dung học tập</p>
              </div>
            </div>
            <div className="stat-item">
              <BiTrophy size={24} color="#2563eb" />
              <div>
                <h3>Chứng chỉ</h3>
                <p>Khi hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
        <div className="beginner-hero-image">
          <img 
            src={begginer} 
            alt="Beginner Course" 
          />
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="overview-container">
          <h2 className="section-title">Bạn sẽ học được gì?</h2>
          <div className="overview-grid">
            <OverviewCard
              icon={<FaBook size={28} />}
              iconColor="#2563eb"
              title="Nền tảng vững chắc"
              description="Học 26 chữ cái, phát âm chuẩn và ngữ điệu tự nhiên"
            />
            <OverviewCard
              icon={<FaPencilAlt size={28} />}
              iconColor="#2563eb"
              title="Từ vựng thiết yếu"
              description="Hơn 200 từ vựng cơ bản thường dùng hàng ngày"
            />
            <OverviewCard
              icon={<FaComments size={28} />}
              iconColor="#2563eb"
              title="Ngữ pháp cơ bản"
              description="Các cấu trúc câu đơn giản và thì hiện tại đơn"
            />
            <OverviewCard
              icon={<FaHeadphones size={28} />}
              iconColor="#2563eb"
              title="Giao tiếp thực tế"
              description="Các mẫu câu giao tiếp hữu ích trong cuộc sống"
            />
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-content">
        <div className="content-container">
          <h2 className="section-title">Nội dung khóa học</h2>
          <p className="section-subtitle">
            4 modules được thiết kế khoa học, từ cơ bản đến nâng cao
          </p>
          
          <div className="modules-list">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <div 
                  className="module-header"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="module-info">
                    <div className="module-icon">{module.icon}</div>
                    <div className="module-text">
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </div>
                  </div>
                  <div className="module-progress-info">
                    <div className="progress-circle">
                      <svg width="60" height="60">
                        <circle 
                          cx="30" 
                          cy="30" 
                          r="25" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="4"
                        />
                        <circle 
                          cx="30" 
                          cy="30" 
                          r="25" 
                          fill="none" 
                          stroke="#2563eb" 
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 25}`}
                          strokeDashoffset={`${2 * Math.PI * 25 * (1 - module.progress / 100)}`}
                          transform="rotate(-90 30 30)"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="progress-text">{module.progress}%</span>
                    </div>
                    <span className={`expand-icon ${activeModule === module.id ? 'active' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                
                {activeModule === module.id && (
                  <div className="module-lessons">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className={`lesson-item ${lesson.completed ? 'completed' : ''}`}>
                        <div className="lesson-info">
                          <div className="lesson-icon">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="lesson-text">
                            <h4>{lesson.title}</h4>
                            <span className="lesson-duration">
                              <FaClock size={12} /> {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="lesson-status">
                          {lesson.completed ? (
                            <FaCheckCircle size={20} color="#10b981" />
                          ) : (
                            <button className="start-lesson-btn">Bắt đầu</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="why-choose-container">
          <h2 className="section-title">Tại sao chọn khóa Beginner?</h2>
          <div className="why-choose-grid">
            <div className="why-item">
              <FaStar size={32} color="#fbbf24" />
              <h3>Phù hợp người mới</h3>
              <p>Được thiết kế đặc biệt cho người bắt đầu từ con số 0</p>
            </div>
            <div className="why-item">
              <FaHeadphones size={32} color="#2563eb" />
              <h3>Học mọi lúc mọi nơi</h3>
              <p>Linh hoạt thời gian, học theo tốc độ của riêng bạn</p>
            </div>
            <div className="why-item">
              <BiTrophy size={32} color="#10b981" />
              <h3>Chứng chỉ hoàn thành</h3>
              <p>Nhận chứng chỉ khi hoàn thành 100% khóa học</p>
            </div>
            <div className="why-item">
              <FaComments size={32} color="#8b5cf6" />
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ giáo viên sẵn sàng giải đáp mọi thắc mắc</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng bắt đầu hành trình của bạn?</h2>
          <p>Tham gia cùng hàng nghìn học viên đã thành công với EngHub</p>
          <button className="cta-button">Bắt đầu học ngay</button>
        </div>
      </section>
    </div>
  );
};

export default BeginnerPage;
