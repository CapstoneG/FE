import React, { useState, useEffect } from 'react';
import '@/styles/courses/BeginnerPage.css'
import { FaBook, FaHeadphones, FaPencilAlt, FaComments, FaStar, FaClock, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';
import begginer from '@/assets/beginner.jpg';
import { OverviewCard } from '@/components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LessonDetail from '@/pages/lesson/LessonDetail';

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
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonParam = searchParams.get('lesson');
  const activeLessonId = lessonParam ? parseInt(lessonParam, 10) : null;

  const getIconByName = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'FaBook': <FaBook size={32} />,
      'FaPencilAlt': <FaPencilAlt size={32} />,
      'FaComments': <FaComments size={32} />,
      'FaHeadphones': <FaHeadphones size={32} />,
    };
    return iconMap[iconName] || <FaBook size={32} />;
  };

  const calculateProgress = (lessons: Lesson[]): number => {
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/api/v1/courses/1/units', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const responseData = await response.json();
        const data = responseData.result;

        const transformedModules: Module[] = data.map((module: any) => {
          const transformedLessons: Lesson[] = module.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            duration: `${lesson.duration} phút`,
            completed: lesson.completed,
            type: lesson.type as 'video' | 'exercise' | 'quiz'
          }));

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

  // Start lesson: if not authenticated, redirect to login and preserve return URL
  const handleStartLesson = (lessonId: number) => {
    const token = localStorage.getItem('authToken');
    const returnUrl = `/courses/beginner?lesson=${lessonId}`;
    if (!token) {
      navigate(`/login?next=${encodeURIComponent(returnUrl)}`);
      return;
    }
    navigate(returnUrl);
  };

  const getLessonIcon = (type: string) => {
    switch(type) {
      case 'video': return <FaPlay size={16} />;
      case 'exercise': return <FaPencilAlt size={16} />;
      case 'quiz': return <MdQuiz size={16} />;
      default: return <FaBook size={16} />;
    }
  };
  if (activeLessonId) {
    return (
      <div className="beginner-page">
        <LessonDetail
          lessonId={activeLessonId}
          onBack={() => navigate('/courses/beginner')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="beginner-page">
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
            <div className="stat-item-beginner">
              <FaBook size={24} color="#2563eb" />
              <div>
                <h3>4 Modules</h3>
                <p>Học từ cơ bản</p>
              </div>
            </div>
            <div className="stat-item-beginner">
              <FaClock size={24} color="#2563eb" />
              <div>
                <h3>20+ Giờ</h3>
                <p>Nội dung học tập</p>
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
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-content">
        <div className="content-container">
          <h2 className="section-title">Nội dung khóa học</h2>
          <p className="section-subtitle">
            2 modules được thiết kế khoa học, từ cơ bản đến nâng cao
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
                    {module.lessons.map((lesson, index) => {
                      // Check if previous lesson is completed
                      const isLocked = index > 0 && !module.lessons[index - 1].completed;
                      
                      return (
                        <div key={lesson.id} className={`lesson-item ${lesson.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
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
                              <button
                                className={`start-lesson-btn ${isLocked ? 'locked' : ''}`}
                                disabled={isLocked}
                                onClick={() => !isLocked && handleStartLesson(lesson.id)}
                                title={isLocked ? "Hoàn thành bài trước để mở khóa" : ""}
                              >
                                Bắt đầu
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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

    </div>
  );
};

export default BeginnerPage;
