import React from 'react';

export const ProfileDashboard: React.FC = () => {
  // Mock data cho biểu đồ và skills
  const weeklyProgress = [
    { day: 'T2', hours: 2.5 },
    { day: 'T3', hours: 1.8 },
    { day: 'T4', hours: 3.2 },
    { day: 'T5', hours: 2.1 },
    { day: 'T6', hours: 4.0 },
    { day: 'T7', hours: 1.5 },
    { day: 'CN', hours: 3.8 },
  ];

  const skills = [
    { name: 'Listening', icon: '🎧', score: 72, color: '#4CAF50' },
    { name: 'Speaking', icon: '🗣️', score: 65, color: '#FF9800' },
    { name: 'Reading', icon: '📖', score: 80, color: '#2196F3' },
    { name: 'Writing', icon: '✍️', score: 70, color: '#9C27B0' },
  ];

  const currentCourses = [
    {
      id: 1,
      title: 'English Conversation Basics',
      image: '/src/assets/bk.jpg',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15
    },
    {
      id: 2,
      title: 'Business English',
      image: '/src/assets/bk.jpg',
      progress: 40,
      totalLessons: 16,
      completedLessons: 6
    },
    {
      id: 3,
      title: 'IELTS Preparation',
      image: '/src/assets/bk.jpg',
      progress: 60,
      totalLessons: 25,
      completedLessons: 15
    }
  ];

  const maxHours = Math.max(...weeklyProgress.map(day => day.hours));

  return (
    <div className="profile-dashboard">
      {/* Progress Chart Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>📊 Tiến độ học tập 7 ngày qua</h3>
        </div>
        <div className="progress-chart">
          <div className="chart-container">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar"
                  style={{ 
                    height: `${(day.hours / maxHours) * 100}%`,
                    backgroundColor: day.hours >= 3 ? '#4CAF50' : day.hours >= 2 ? '#FF9800' : '#E0E0E0'
                  }}
                ></div>
                <div className="bar-value">{day.hours}h</div>
                <div className="bar-label">{day.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>🎯 Kỹ năng tiếng Anh</h3>
        </div>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-name">{skill.name}</span>
              </div>
              <div className="skill-progress">
                <div className="skill-score">{skill.score}/100</div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill"
                    style={{ 
                      width: `${skill.score}%`,
                      backgroundColor: skill.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Courses Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>📚 Khóa học đang học</h3>
          <button className="view-all-btn">Xem tất cả</button>
        </div>
        <div className="courses-grid">
          {currentCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-progress-overlay">
                  <div className="progress-circle">
                    <svg className="progress-ring" width="40" height="40">
                      <circle
                        className="progress-ring-circle"
                        stroke="#E0E0E0"
                        strokeWidth="3"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                      />
                      <circle
                        className="progress-ring-circle"
                        stroke="#4CAF50"
                        strokeWidth="3"
                        fill="transparent"
                        r="16"
                        cx="20"
                        cy="20"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 16}`,
                          strokeDashoffset: `${2 * Math.PI * 16 * (1 - course.progress / 100)}`,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%'
                        }}
                      />
                    </svg>
                    <span className="progress-text">{course.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="course-content">
                <h4 className="course-title">{course.title}</h4>
                <p className="course-lessons">
                  {course.completedLessons}/{course.totalLessons} bài học
                </p>
                <button className="continue-btn">
                  <span>▶️</span>
                  Tiếp tục học
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};