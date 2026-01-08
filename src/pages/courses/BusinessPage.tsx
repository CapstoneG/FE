import React, { useState, useEffect } from 'react';
import '@/styles/courses/BusinessPage.css'
import { FaBook, FaPencilAlt, FaComments, FaStar, FaClock, FaCheckCircle, FaPlay, FaGlobe, FaBriefcase, FaHandshake, FaChartLine, FaUsers, FaLaptopCode, FaChalkboardTeacher } from 'react-icons/fa';
import { MdQuiz, MdEmail, MdPhone } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { HiDocumentText } from 'react-icons/hi';
import { OverviewCard } from '@/components';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'exercise' | 'quiz' | 'roleplay';
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: React.ReactNode;
  progress: number;
}

const BusinessPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const getIconByName = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'FaBook': <FaBook size={32} />,
      'FaPencilAlt': <FaPencilAlt size={32} />,
      'FaComments': <FaComments size={32} />,
      'FaGlobe': <FaGlobe size={32} />,
      'FaBriefcase': <FaBriefcase size={32} />,
      'FaHandshake': <FaHandshake size={32} />,
      'FaChalkboardTeacher': <FaChalkboardTeacher size={32} />,
      'HiDocumentText': <HiDocumentText size={32} />,
      'FaLaptopCode': <FaLaptopCode size={32} />,
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
        const response = await fetch('http://localhost:8080/api/v1/courses/4/units');
        
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
            type: lesson.type as 'video' | 'exercise' | 'quiz' | 'roleplay'
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
      case 'roleplay': return <FaUsers size={16} />;
      default: return <FaBook size={16} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="business-page">
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
    <div className="business-page">
      {/* Hero Section */}
      <section className="business-hero">
        <div className="business-hero-content">
          <div className="hero-badge">
            <FaBriefcase size={18} />
            <span>BUSINESS ENGLISH</span>
          </div>
          <h1 className="business-hero-title">
            <span className="highlight">Tiếng Anh Thương Mại</span>
          </h1>
          <p className="business-hero-subtitle">
            Chinh phục môi trường kinh doanh quốc tế với kỹ năng giao tiếp chuyên nghiệp
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <FaBriefcase size={24} color="#0ea5e9" />
              <div>
                <h3>6 Modules</h3>
                <p>Thực chiến doanh nghiệp</p>
              </div>
            </div>
            <div className="stat-item">
              <FaClock size={24} color="#0ea5e9" />
              <div>
                <h3>40+ Giờ</h3>
                <p>Học tập tập trung</p>
              </div>
            </div>
          </div>
        </div>
        <div className="business-hero-image">
          <img 
            src="https://i.pinimg.com/1200x/a4/26/5e/a4265e96fc5a8c169bc26e795260c00c.jpg" 
            alt="Business English Course" 
          />
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="overview-container">
          <h2 className="section-title">Kỹ năng bạn sẽ đạt được</h2>
          <p className="section-subtitle">Trở thành chuyên gia giao tiếp trong môi trường doanh nghiệp</p>
          <div className="overview-grid">
            <OverviewCard
              icon={<MdEmail size={30} />}
              iconColor="#0ea5e9"
              title="Email & Correspondence"
              description="Viết email chuyên nghiệp, đề xuất và các tài liệu kinh doanh"
            />
            <OverviewCard
              icon={<FaChalkboardTeacher size={30} />}
              iconColor="#0ea5e9"
              title="Presentations Skills"
              description="Thuyết trình tự tin, thuyết phục và ấn tượng trước khách hàng"
            />
            <OverviewCard
              icon={<FaHandshake size={30} />}
              iconColor="#0ea5e9"
              title="Negotiations"
              description="Đàm phán hiệu quả và tạo ra giải pháp win-win cho cả hai bên"
            />
            <OverviewCard
              icon={<MdPhone size={30} />}
              iconColor="#0ea5e9"
              title="Business Calls"
              description="Giao tiếp qua điện thoại và họp online chuyên nghiệp"
            />
            <OverviewCard
              icon={<FaGlobe size={30} />}
              iconColor="#0ea5e9"
              title="Cross-Cultural"
              description="Làm việc hiệu quả với đối tác quốc tế đa văn hóa"
            />
            <OverviewCard
              icon={<HiDocumentText size={30} />}
              iconColor="#0ea5e9"
              title="Business Writing"
              description="Soạn thảo báo cáo, đề xuất và tài liệu kinh doanh chuyên nghiệp"
            />
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="target-audience">
        <div className="audience-container">
          <h2 className="section-title">Khóa học phù hợp với</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">
                <FaBriefcase size={40} color="#0ea5e9" />
              </div>
              <h3>Nhân viên văn phòng</h3>
              <p>Muốn thăng tiến trong môi trường làm việc quốc tế</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">
                <FaChartLine size={40} color="#0ea5e9" />
              </div>
              <h3>Quản lý & Lãnh đạo</h3>
              <p>Cần kỹ năng giao tiếp để điều hành và thuyết trình</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">
                <FaUsers size={40} color="#0ea5e9" />
              </div>
              <h3>Sales & Marketing</h3>
              <p>Tương tác với khách hàng và đối tác nước ngoài</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">
                <FaGlobe size={40} color="#0ea5e9" />
              </div>
              <h3>Khởi nghiệp</h3>
              <p>Mở rộng kinh doanh ra thị trường quốc tế</p>
            </div>
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
                <IoMdCheckmarkCircleOutline size={28} color="#0ea5e9" />
                <div>
                  <h4>Trình độ Intermediate trở lên</h4>
                  <p>Hoặc IELTS 5.5+ / TOEIC 650+</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#0ea5e9" />
                <div>
                  <h4>Kinh nghiệm làm việc</h4>
                  <p>Có trải nghiệm trong môi trường văn phòng hoặc kinh doanh</p>
                </div>
              </div>
              <div className="prerequisite-item">
                <IoMdCheckmarkCircleOutline size={28} color="#0ea5e9" />
                <div>
                  <h4>Mục tiêu nghề nghiệp rõ ràng</h4>
                  <p>Muốn phát triển sự nghiệp trong môi trường quốc tế</p>
                </div>
              </div>
            </div>
            <div className="prerequisites-image">
              <img 
                src="https://i.pinimg.com/1200x/f3/16/3b/f3163b86a2ccbba6265471ac46665bc7.jpg" 
                alt="Business Prerequisites" 
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
            6 modules với hơn 40 giờ thực hành trong môi trường doanh nghiệp
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
                          stroke="#0ea5e9" 
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

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">Lợi ích khi hoàn thành khóa học</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <FaChartLine size={36} color="#0ea5e9" />
              <h3>Thăng tiến nhanh chóng</h3>
              <p>Tăng cơ hội được thăng chức và tăng lương trong công ty</p>
            </div>
            <div className="benefit-item">
              <FaGlobe size={36} color="#0ea5e9" />
              <h3>Mở rộng cơ hội việc làm</h3>
              <p>Làm việc cho các công ty đa quốc gia hàng đầu</p>
            </div>
            <div className="benefit-item">
              <FaHandshake size={36} color="#0ea5e9" />
              <h3>Mạng lưới quan hệ</h3>
              <p>Kết nối với các chuyên gia và doanh nhân quốc tế</p>
            </div>
            <div className="benefit-item">
              <BiTrophy size={36} color="#0ea5e9" />
              <h3>Tự tin trong giao tiếp</h3>
              <p>Tự tin thuyết trình và đàm phán trong mọi tình huống</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="why-choose-container">
          <h2 className="section-title">Tại sao chọn khóa Business English?</h2>
          <div className="why-choose-grid">
            <div className="why-item">
              <FaStar size={32} color="#fbbf24" />
              <h3>Học từ thực tế</h3>
              <p>Nội dung dựa trên tình huống thực tế trong doanh nghiệp</p>
            </div>
            <div className="why-item">
              <FaUsers size={32} color="#0ea5e9" />
              <h3>Role-play thực hành</h3>
              <p>Luyện tập qua các tình huống mô phỏng môi trường làm việc</p>
            </div>
            <div className="why-item">
              <BiTrophy size={32} color="#10b981" />
              <h3>Mentor chuyên gia</h3>
              <p>Được hướng dẫn bởi các chuyên gia có kinh nghiệm doanh nghiệp</p>
            </div>
            <div className="why-item">
              <FaBriefcase size={32} color="#7c3aed" />
              <h3>Chứng chỉ công nhận</h3>
              <p>Chứng chỉ được các doanh nghiệp trong và ngoài nước công nhận</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BusinessPage;
