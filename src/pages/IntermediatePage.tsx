import React, { useState } from 'react';
import './IntermediatePage.css';
import { FaBook, FaHeadphones, FaPencilAlt, FaComments, FaStar, FaClock, FaCheckCircle, FaPlay, FaGlobe, FaBriefcase } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
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

const IntermediatePage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const modules: Module[] = [
    {
      id: 1,
      title: "Ngữ pháp nâng cao",
      description: "Các thì phức tạp và cấu trúc câu nâng cao",
      icon: <FaBook size={32} />,
      progress: 60,
      lessons: [
        { id: 1, title: "Thì hiện tại hoàn thành", duration: "18 phút", completed: true, type: "video" },
        { id: 2, title: "Thực hành hiện tại hoàn thành", duration: "20 phút", completed: true, type: "exercise" },
        { id: 3, title: "Thì quá khứ hoàn thành", duration: "16 phút", completed: true, type: "video" },
        { id: 4, title: "Câu điều kiện loại 1 & 2", duration: "22 phút", completed: false, type: "video" },
        { id: 5, title: "Bài tập câu điều kiện", duration: "25 phút", completed: false, type: "exercise" },
        { id: 6, title: "Kiểm tra tổng hợp", duration: "30 phút", completed: false, type: "quiz" },
      ]
    },
    {
      id: 2,
      title: "Từ vựng chuyên sâu",
      description: "1000+ từ vựng theo chủ đề và idioms phổ biến",
      icon: <FaPencilAlt size={32} />,
      progress: 40,
      lessons: [
        { id: 1, title: "Từ vựng công việc", duration: "15 phút", completed: true, type: "video" },
        { id: 2, title: "Idioms thông dụng Part 1", duration: "18 phút", completed: true, type: "video" },
        { id: 3, title: "Luyện tập idioms", duration: "12 phút", completed: false, type: "exercise" },
        { id: 4, title: "Phrasal verbs quan trọng", duration: "20 phút", completed: false, type: "video" },
        { id: 5, title: "Từ vựng du lịch", duration: "16 phút", completed: false, type: "video" },
        { id: 6, title: "Kiểm tra từ vựng", duration: "25 phút", completed: false, type: "quiz" },
      ]
    },
    {
      id: 3,
      title: "Luyện nghe - Nói",
      description: "Rèn luyện kỹ năng giao tiếp tự tin và lưu loát",
      icon: <FaHeadphones size={32} />,
      progress: 35,
      lessons: [
        { id: 1, title: "Nghe hiểu hội thoại thực tế", duration: "20 phút", completed: true, type: "video" },
        { id: 2, title: "Phát âm và ngữ điệu", duration: "15 phút", completed: true, type: "video" },
        { id: 3, title: "Thực hành hội thoại", duration: "25 phút", completed: false, type: "exercise" },
        { id: 4, title: "Nghe tin tức BBC", duration: "18 phút", completed: false, type: "video" },
        { id: 5, title: "Thảo luận nhóm", duration: "30 phút", completed: false, type: "exercise" },
      ]
    },
    {
      id: 4,
      title: "Đọc - Viết",
      description: "Nâng cao khả năng đọc hiểu và viết học thuật",
      icon: <FaComments size={32} />,
      progress: 25,
      lessons: [
        { id: 1, title: "Đọc hiểu bài báo", duration: "20 phút", completed: true, type: "video" },
        { id: 2, title: "Kỹ thuật skimming & scanning", duration: "15 phút", completed: false, type: "video" },
        { id: 3, title: "Viết email chuyên nghiệp", duration: "18 phút", completed: false, type: "video" },
        { id: 4, title: "Viết essay cơ bản", duration: "25 phút", completed: false, type: "video" },
        { id: 5, title: "Luyện tập viết", duration: "30 phút", completed: false, type: "exercise" },
      ]
    },
    {
      id: 5,
      title: "English for Business",
      description: "Tiếng Anh thương mại và giao tiếp công sở",
      icon: <FaBriefcase size={32} />,
      progress: 0,
      lessons: [
        { id: 1, title: "Giao tiếp qua điện thoại", duration: "16 phút", completed: false, type: "video" },
        { id: 2, title: "Thuyết trình công việc", duration: "22 phút", completed: false, type: "video" },
        { id: 3, title: "Đàm phán cơ bản", duration: "20 phút", completed: false, type: "video" },
        { id: 4, title: "Viết báo cáo", duration: "25 phút", completed: false, type: "video" },
        { id: 5, title: "Meeting & Discussion", duration: "18 phút", completed: false, type: "exercise" },
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
    <div className="intermediate-page">
      {/* Hero Section */}
      <section className="intermediate-hero">
        <div className="intermediate-hero-content">
          <h1 className="intermediate-hero-title">
            <span className="highlight">Khóa học Intermediate</span>
          </h1>
          <p className="intermediate-hero-subtitle">
            Nâng cao kỹ năng tiếng Anh lên một tầm cao mới
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <FaBook size={24} color="#f59e0b" />
              <div>
                <h3>5 Modules</h3>
                <p>Học chuyên sâu</p>
              </div>
            </div>
            <div className="stat-item">
              <FaClock size={24} color="#f59e0b" />
              <div>
                <h3>35+ Giờ</h3>
                <p>Nội dung phong phú</p>
              </div>
            </div>
            <div className="stat-item">
              <BiTrophy size={24} color="#f59e0b" />
              <div>
                <h3>Chứng chỉ</h3>
                <p>Quốc tế</p>
              </div>
            </div>
          </div>
        </div>
        <div className="intermediate-hero-image">
          <img 
            src="https://i.pinimg.com/736x/2c/87/bc/2c87bc24c383a745380ca77254b9f4c0.jpg" 
            alt="Intermediate Course" 
          />
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="overview-container">
          <h2 className="section-title">Bạn sẽ đạt được gì?</h2>
          <div className="overview-grid">
            <OverviewCard
              icon={<FaBook size={28} />}
              iconColor="#f59e0b"
              title="Ngữ pháp nâng cao"
              description="Nắm vững các thì phức tạp, câu điều kiện và cấu trúc câu chuyên sâu"
            />
            <OverviewCard
              icon={<FaGlobe size={28} />}
              iconColor="#f59e0b"
              title="Từ vựng đa dạng"
              description="Hơn 1000 từ vựng, idioms và phrasal verbs thông dụng"
            />
            <OverviewCard
              icon={<FaHeadphones size={28} />}
              iconColor="#f59e0b"
              title="Giao tiếp tự tin"
              description="Phát triển kỹ năng nghe - nói trong các tình huống thực tế"
            />
            <OverviewCard
              icon={<FaBriefcase size={28} />}
              iconColor="#f59e0b"
              title="Business English"
              description="Tiếng Anh thương mại và giao tiếp trong môi trường công sở"
            />
          </div>
        </div>
      </section>

      {/* Prerequisites Section */}
      <section className="prerequisites-section">
        <div className="prerequisites-container">
          <h2 className="section-title">Yêu cầu đầu vào</h2>
          <div className="prerequisites-content">
            <div className="prerequisites-list">
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#10b981" />
                <div>
                  <h4>Hoàn thành khóa Beginner</h4>
                  <p>Hoặc có kiến thức tương đương</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#10b981" />
                <div>
                  <h4>Vốn từ vựng 500+ từ</h4>
                  <p>Nắm vững từ vựng cơ bản</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#10b981" />
                <div>
                  <h4>Hiểu ngữ pháp cơ bản</h4>
                  <p>Các thì đơn giản và cấu trúc câu căn bản</p>
                </div>
              </div>
            </div>
            <div className="prerequisites-image">
              <img 
                src="https://i.pinimg.com/1200x/f3/16/3b/f3163b86a2ccbba6265471ac46665bc7.jpg" 
                alt="Prerequisites" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-content">
        <div className="content-container">
          <h2 className="section-title">Nội dung khóa học</h2>
          <p className="section-subtitle">
            5 modules với hơn 35 giờ học chuyên sâu
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
                          stroke="#f59e0b" 
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
          <h2 className="section-title">Tại sao chọn khóa Intermediate?</h2>
          <div className="why-choose-grid">
            <div className="why-item">
              <FaStar size={32} color="#fbbf24" />
              <h3>Phù hợp trình độ</h3>
              <p>Được thiết kế cho người đã có nền tảng và muốn tiến bộ</p>
            </div>
            <div className="why-item">
              <FaGlobe size={32} color="#f59e0b" />
              <h3>Nội dung thực tế</h3>
              <p>Học qua các tình huống giao tiếp thực tế hàng ngày</p>
            </div>
            <div className="why-item">
              <BiTrophy size={32} color="#10b981" />
              <h3>Chứng chỉ quốc tế</h3>
              <p>Chứng chỉ được công nhận giá trị trên toàn cầu</p>
            </div>
            <div className="why-item">
              <FaBriefcase size={32} color="#2563eb" />
              <h3>Hướng nghề nghiệp</h3>
              <p>Chuẩn bị tiếng Anh cho công việc và sự nghiệp</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng nâng cấp trình độ của bạn?</h2>
          <p>Tham gia khóa Intermediate và đạt mục tiêu tiếng Anh của bạn</p>
          <button className="cta-button">Đăng ký ngay</button>
        </div>
      </section>
    </div>
  );
};

export default IntermediatePage;
