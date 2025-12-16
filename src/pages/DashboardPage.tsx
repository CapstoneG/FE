import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAuth } from '../hooks/useAuth';

interface LessonItem {
  id: number;
  title: string;
  type: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
}

interface PracticeCard {
  id: number;
  title: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

interface WeeklyData {
  day: string;
  minutes: number;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockData = {
      user: {
        name: user?.fullName || user?.username || 'John Doe',
        avatar: user?.avatar || 'https://ui-avatars.com/api/?name=John+Doe&background=4CAF50&color=fff&size=120',
        level: 'Intermediate B1',
        streak: 12,
        xp: 2450,
        nextLevelXp: 3000
      },
      progress: {
        courseCompletion: 67,
        lessonsCompleted: 34,
        totalLessons: 51,
        studyTimeToday: 45,
        weeklyAverage: 38
      },
      learningPath: [
        { id: 1, title: 'Present Perfect Tense', type: 'Grammar', status: 'completed', progress: 100 },
        { id: 2, title: 'Business Vocabulary', type: 'Vocabulary', status: 'in-progress', progress: 65 },
        { id: 3, title: 'Conversation Practice', type: 'Speaking', status: 'in-progress', progress: 30 },
        { id: 4, title: 'Listening Comprehension', type: 'Listening', status: 'locked', progress: 0 },
        { id: 5, title: 'Writing Email', type: 'Writing', status: 'locked', progress: 0 }
      ] as LessonItem[],
      practiceCards: [
        { id: 1, title: 'Vocabulary', icon: '📚', description: 'Learn new words', count: 150, color: '#FF6B6B' },
        { id: 2, title: 'Listening', icon: '🎧', description: 'Improve comprehension', count: 23, color: '#4ECDC4' },
        { id: 3, title: 'Speaking', icon: '🎤', description: 'Practice pronunciation', count: 12, color: '#95E1D3' },
        { id: 4, title: 'Grammar', icon: '✍️', description: 'Master rules', count: 45, color: '#F38181' }
      ] as PracticeCard[],
      weeklyStats: [
        { day: 'Mon', minutes: 30 },
        { day: 'Tue', minutes: 45 },
        { day: 'Wed', minutes: 25 },
        { day: 'Thu', minutes: 50 },
        { day: 'Fri', minutes: 40 },
        { day: 'Sat', minutes: 60 },
        { day: 'Sun', minutes: 35 }
      ] as WeeklyData[],
      analytics: {
        accuracyRate: 87,
        totalStudyTime: 285,
        averageScore: 92
      },
      dailyGoal: {
        target: 60,
        current: 45,
        percentage: 75
      },
      badges: [
        { id: 1, name: '7-Day Streak', icon: '🔥', earned: true },
        { id: 2, name: 'Grammar Master', icon: '📖', earned: true },
        { id: 3, name: 'Fast Learner', icon: '⚡', earned: true },
        { id: 4, name: 'Perfect Score', icon: '🎯', earned: false },
        { id: 5, name: 'Vocabulary Pro', icon: '🌟', earned: false },
        { id: 6, name: 'Speaking Champion', icon: '🏆', earned: false }
      ] as Badge[]
    };

    setDashboardData(mockData);
  }, [user]);

  if (!dashboardData) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const maxWeeklyMinutes = Math.max(...dashboardData.weeklyStats.map((d: WeeklyData) => d.minutes));

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>📊 Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">
            <span className="nav-icon">🏠</span>
            Overview
          </a>
          <a href="#lessons" className="nav-item">
            <span className="nav-icon">📚</span>
            My Lessons
          </a>
          <a href="#progress" className="nav-item">
            <span className="nav-icon">📈</span>
            Progress
          </a>
          <a href="#practice" className="nav-item">
            <span className="nav-icon">✨</span>
            Practice
          </a>
          <a href="#achievements" className="nav-item">
            <span className="nav-icon">🏆</span>
            Achievements
          </a>
          <a href="#settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header Section */}
          <section className="dashboard-header">
            <h1>Welcome back, {dashboardData.user.name}! 👋</h1>
            <p className="header-subtitle">Let's continue your learning journey</p>
          </section>

          {/* User Info Card */}
          <section className="user-info-card">
            <div className="user-avatar">
              <img src={dashboardData.user.avatar} alt={dashboardData.user.name} />
              <div className="streak-badge">
                <span className="streak-icon">🔥</span>
                <span className="streak-count">{dashboardData.user.streak}</span>
              </div>
            </div>
            <div className="user-details">
              <h2>{dashboardData.user.name}</h2>
              <p className="user-level">{dashboardData.user.level}</p>
              <div className="xp-bar">
                <div className="xp-progress" style={{ width: `${(dashboardData.user.xp / dashboardData.user.nextLevelXp) * 100}%` }}></div>
              </div>
              <p className="xp-text">{dashboardData.user.xp} / {dashboardData.user.nextLevelXp} XP</p>
            </div>
            <div className="user-stats">
              <div className="stat-item">
                <div className="stat-value">{dashboardData.user.streak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{dashboardData.user.xp}</div>
                <div className="stat-label">Total XP</div>
              </div>
            </div>
          </section>

          {/* Progress Section */}
          <section className="progress-section">
            <h3 className="section-title">📊 Your Progress</h3>
            <div className="progress-cards">
              <div className="progress-card">
                <div className="progress-card-header">
                  <h4>Course Progress</h4>
                  <span className="progress-percentage">{dashboardData.progress.courseCompletion}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dashboardData.progress.courseCompletion}%` }}></div>
                </div>
                <p className="progress-detail">
                  {dashboardData.progress.lessonsCompleted} of {dashboardData.progress.totalLessons} lessons completed
                </p>
              </div>

              <div className="progress-card">
                <div className="progress-card-icon">⏱️</div>
                <h4>Study Time Today</h4>
                <div className="progress-value">{dashboardData.progress.studyTimeToday} min</div>
                <p className="progress-detail">Weekly avg: {dashboardData.progress.weeklyAverage} min</p>
              </div>

              <div className="progress-card">
                <div className="progress-card-icon">🎯</div>
                <h4>Accuracy Rate</h4>
                <div className="progress-value">{dashboardData.analytics.accuracyRate}%</div>
                <p className="progress-detail">Keep up the great work!</p>
              </div>
            </div>
          </section>

          {/* Learning Path Section */}
          <section className="learning-path-section">
            <div className="section-header">
              <h3 className="section-title">🎓 Learning Path</h3>
              <button className="continue-btn">Continue Learning →</button>
            </div>
            <div className="lessons-list">
              {dashboardData.learningPath.map((lesson: LessonItem) => (
                <div key={lesson.id} className={`lesson-item ${lesson.status}`}>
                  <div className="lesson-status-icon">
                    {lesson.status === 'completed' && '✅'}
                    {lesson.status === 'in-progress' && '▶️'}
                    {lesson.status === 'locked' && '🔒'}
                  </div>
                  <div className="lesson-content">
                    <h4>{lesson.title}</h4>
                    <p className="lesson-type">{lesson.type}</p>
                    {lesson.status === 'in-progress' && (
                      <div className="lesson-progress-bar">
                        <div className="lesson-progress-fill" style={{ width: `${lesson.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                  <div className="lesson-action">
                    {lesson.status === 'completed' && <span className="lesson-badge">100%</span>}
                    {lesson.status === 'in-progress' && (
                      <button className="lesson-continue-btn">Continue</button>
                    )}
                    {lesson.status === 'locked' && <span className="lesson-locked">Locked</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Practice Section */}
          <section className="practice-section">
            <h3 className="section-title">✨ Quick Practice</h3>
            <div className="practice-grid">
              {dashboardData.practiceCards.map((card: PracticeCard) => (
                <div key={card.id} className="practice-card" style={{ borderColor: card.color }}>
                  <div className="practice-icon" style={{ backgroundColor: card.color }}>
                    {card.icon}
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <div className="practice-count">{card.count} exercises</div>
                  <button className="practice-btn" style={{ backgroundColor: card.color }}>
                    Start Practice
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-row">
            {/* Analytics Section */}
            <section className="analytics-section">
              <h3 className="section-title">📈 Weekly Activity</h3>
              <div className="chart-container">
                <div className="bar-chart">
                  {dashboardData.weeklyStats.map((stat: WeeklyData, index: number) => (
                    <div key={index} className="bar-wrapper">
                      <div className="bar-container">
                        <div
                          className="bar"
                          style={{ height: `${(stat.minutes / maxWeeklyMinutes) * 100}%` }}
                          title={`${stat.minutes} minutes`}
                        >
                          <span className="bar-value">{stat.minutes}</span>
                        </div>
                      </div>
                      <div className="bar-label">{stat.day}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analytics-summary">
                <div className="summary-item">
                  <span className="summary-label">Total this week:</span>
                  <span className="summary-value">{dashboardData.analytics.totalStudyTime} min</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average score:</span>
                  <span className="summary-value">{dashboardData.analytics.averageScore}%</span>
                </div>
              </div>
            </section>

            {/* Goals Section */}
            <section className="goals-section">
              <h3 className="section-title">🎯 Daily Goal</h3>
              <div className="goal-card">
                <div className="goal-circle">
                  <svg className="goal-svg" viewBox="0 0 120 120">
                    <circle
                      className="goal-bg"
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="8"
                    />
                    <circle
                      className="goal-progress"
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - dashboardData.dailyGoal.percentage / 100)}`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="goal-text">
                    <div className="goal-percentage">{dashboardData.dailyGoal.percentage}%</div>
                    <div className="goal-subtitle">Complete</div>
                  </div>
                </div>
                <p className="goal-description">
                  {dashboardData.dailyGoal.current} / {dashboardData.dailyGoal.target} minutes
                </p>
              </div>

              <h4 className="badges-title">🏆 Badges & Achievements</h4>
              <div className="badges-grid">
                {dashboardData.badges.map((badge: Badge) => (
                  <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-name">{badge.name}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
