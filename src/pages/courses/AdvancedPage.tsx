import React, { useState, useEffect } from 'react';
import '@/styles/courses/AdvancedPage.css'
import { FaBook, FaHeadphones, FaPencilAlt, FaComments, FaStar, FaClock, FaCheckCircle, FaPlay, FaGlobe, FaBriefcase, FaGraduationCap, FaAward } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RiEnglishInput } from 'react-icons/ri';
import { OverviewCard } from '@/components';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'exercise' | 'quiz' | 'project';
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: React.ReactNode;
  progress: number;
}

const AdvancedPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const getIconByName = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'FaBook': <FaBook size={32} />,
      'FaPencilAlt': <FaPencilAlt size={32} />,
      'FaComments': <FaComments size={32} />,
      'FaHeadphones': <FaHeadphones size={32} />,
      'FaGraduationCap': <FaGraduationCap size={32} />,
      'FaBriefcase': <FaBriefcase size={32} />,
      'FaAward': <FaAward size={32} />,
    };
    return iconMap[iconName] || <FaBook size={32} />;
  };

  // Calculate progress for each module based on completed lessons
  const calculateProgress = (lessons: Lesson[]): number => {
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  // Fetch modules data
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/v1/courses/3/units');
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const responseData = await response.json();
        const data = responseData.result; // Lấy result từ response

        // Transform API data to component format
        const transformedModules: Module[] = data.map((module: any) => {
          // Transform lessons first
          const transformedLessons: Lesson[] = module.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            duration: `${lesson.duration} phút`,
            completed: lesson.completed,
            type: lesson.type as 'video' | 'exercise' | 'quiz' | 'project'
          }));

          // Then calculate progress based on transformed lessons
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            icon: getIconByName(module.icon),
            progress: calculateProgress(transformedLessons),
            lessons: transformedLessons
          };
        });

        setModules(transformedModules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const getLessonIcon = (type: string) => {
    switch(type) {
      case 'video': return <FaPlay size={16} />;
      case 'exercise': return <FaPencilAlt size={16} />;
      case 'quiz': return <MdQuiz size={16} />;
      case 'project': return <FaBriefcase size={16} />;
      default: return <FaBook size={16} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="advanced-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <div className="video-lesson-spinner" />
          <p style={{ marginLeft: '16px' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-page">{/* Hero Section */}
      <section className="advanced-hero">
        <div className="advanced-hero-content">
          <div className="hero-badge">
            <FaAward size={20} />
            <span>TRÌNH ĐỘ CAO CẤP</span>
          </div>
          <h1 className="advanced-hero-title">
            <span className="highlight">Khóa học Advanced</span>
          </h1>
          <p className="advanced-hero-subtitle">
            Làm chủ tiếng Anh ở trình độ chuyên gia và thành thạo như người bản xứ
          </p>
          <div className="hero-stats">
            <div className="stat-item-advanced">
              <FaBook size={24} color="#d7c9f3ff" />
              <div>
                <h3>6 Modules</h3>
                <p>Chuyên sâu cao cấp</p>
              </div>
            </div>
            <div className="stat-item-advanced">
              <FaClock size={24} color="#d7c9f3ff" />
              <div>
                <h3>50+ Giờ</h3>
                <p>Học thuật & Thực hành</p>
              </div>
            </div>
          </div>
        </div>
        <div className="advanced-hero-image">
          <img 
            src="https://i.pinimg.com/1200x/9f/4f/23/9f4f23198d9e78c23c8c231a6b03a0f6.jpg" 
            alt="Advanced Course" 
          />
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="overview-container">
          <h2 className="section-title">Trở thành chuyên gia tiếng Anh</h2>
          <p className="section-subtitle">Phát triển kỹ năng ở mức độ cao nhất</p>
          <div className="overview-grid">
            <OverviewCard
              icon={<FaGraduationCap size={30} />}
              iconColor="#7c3aed"
              title="Ngữ pháp nâng cao"
              description="Làm chủ các cấu trúc ngữ pháp phức tạp như mệnh đề quan hệ nâng cao, câu bị động, đảo ngữ và câu gián tiếp."
            />

            <OverviewCard
              icon={<RiEnglishInput size={30} />}
              iconColor="#7c3aed"
              title="Từ vựng học thuật"
              description="Mở rộng vốn từ vựng học thuật, từ đồng nghĩa, sắc thái nghĩa và cách sử dụng trong ngữ cảnh chuyên sâu."
            />
          </div>
        </div>
      </section>

      {/* Prerequisites Section */}
      <section className="prerequisites-section">
        <div className="prerequisites-container">
          <h2 className="section-title">Yêu cầu đầu vào nghiêm ngặt</h2>
          <p className="section-subtitle">Đảm bảo bạn có nền tảng vững chắc để theo học</p>
          <div className="prerequisites-content">
            <div className="prerequisites-list">
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#7c3aed" />
                <div>
                  <h4>Hoàn thành khóa Intermediate</h4>
                  <p>Hoặc có chứng chỉ IELTS 6.0+ / TOEFL 80+</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#7c3aed" />
                <div>
                  <h4>Vốn từ vựng 3000+ từ</h4>
                  <p>Nắm vững từ vựng trung cấp và phrasal verbs</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#7c3aed" />
                <div>
                  <h4>Thành thạo ngữ pháp nâng cao</h4>
                  <p>Hiểu rõ tất cả các thì và cấu trúc câu phức tạp</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#7c3aed" />
                <div>
                  <h4>Kỹ năng giao tiếp tốt</h4>
                  <p>Có thể thảo luận các chủ đề đa dạng một cách tự tin</p>
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
            2 modules toàn diện với hơn 20 giờ học chuyên sâu
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
                          stroke="#7c3aed" 
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

      {/* Career Opportunities */}
      <section className="career-section">
        <div className="career-container">
          <h2 className="section-title">Cơ hội nghề nghiệp</h2>
          <p className="section-subtitle">Mở ra nhiều cơ hội với trình độ tiếng Anh cao cấp</p>
          <div className="career-grid">
            <div className="career-card">
              <FaGlobe size={40} color="#7c3aed" />
              <h3>Làm việc quốc tế</h3>
              <p>Cơ hội làm việc tại các công ty đa quốc gia hàng đầu</p>
            </div>
            <div className="career-card">
              <FaGraduationCap size={40} color="#7c3aed" />
              <h3>Du học top trường</h3>
              <p>Đủ điều kiện xin học bổng và du học các trường danh tiếng</p>
            </div>
            <div className="career-card">
              <FaBriefcase size={40} color="#7c3aed" />
              <h3>Thăng tiến sự nghiệp</h3>
              <p>Tăng cơ hội thăng tiến và thu nhập cao hơn</p>
            </div>
            <div className="career-card">
              <FaComments size={40} color="#7c3aed" />
              <h3>Giảng dạy & Đào tạo</h3>
              <p>Trở thành giảng viên hoặc chuyên gia đào tạo tiếng Anh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="why-choose-container">
          <h2 className="section-title">Tại sao chọn khóa Advanced?</h2>
          <div className="why-choose-grid">
            <div className="why-item">
              <FaStar size={32} color="#fbbf24" />
              <h3>Đẳng cấp chuyên gia</h3>
              <p>Đạt trình độ tiếng Anh gần như người bản xứ</p>
            </div>
            <div className="why-item">
              <FaAward size={32} color="#7c3aed" />
              <h3>Chứng chỉ uy tín</h3>
              <p>Được công nhận bởi các tổ chức quốc tế hàng đầu</p>
            </div>
            <div className="why-item">
              <BiTrophy size={32} color="#10b981" />
              <h3>Mentor 1-1</h3>
              <p>Được hướng dẫn bởi giảng viên có bằng cấp quốc tế</p>
            </div>
            <div className="why-item">
              <FaGlobe size={32} color="#2563eb" />
              <h3>Kết nối toàn cầu</h3>
              <p>Tham gia cộng đồng học viên và chuyên gia quốc tế</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AdvancedPage;
