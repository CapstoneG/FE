import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAuth } from '../hooks/useAuth';

// New interfaces for redesigned dashboard
interface ContinueLearningItem {
  id: number;
  title: string;
  type: 'lesson' | 'flashcard' | 'test';
  progress: number;
  icon: string;
}

interface FlashcardStat {
  total: number;
  dueToday: number;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const mockData = {
    user: {
      name: user?.fullName || user?.username || 'Learner',
      streak: 12
    },
    dailyGoal: {
      target: 60,
      current: 45,
      percentage: 75
    },
    continueLearning: [
      { id: 1, title: 'Business Vocabulary Unit 5', type: 'lesson' as const, progress: 65, icon: '📚' },
      { id: 2, title: 'Daily Words Practice', type: 'flashcard' as const, progress: 30, icon: '🎴' }
    ] as ContinueLearningItem[],
    stats: {
      lessonsCompleted: 34,
      vocabularyLearned: 458,
      strongSkills: ['Grammar', 'Reading'],
      weakSkills: ['Speaking', 'Listening']
    },
    flashcards: {
      total: 458,
      dueToday: 23
    } as FlashcardStat,
    learningSettings: {
      reminderTime: '19:00',
      daysPerWeek: 5
    },
    badges: [
      { id: 1, name: '7-Day Streak', icon: '🔥', earned: true, description: 'Study 7 days in a row' },
      { id: 2, name: 'Fast Learner', icon: '⚡', earned: true, description: 'Complete 10 lessons' },
      { id: 3, name: 'Vocabulary Master', icon: '📖', earned: false, description: 'Learn 500 words' },
      { id: 4, name: 'Perfect Score', icon: '🎯', earned: false, description: 'Get 100% on a test' }
    ] as Badge[],
    recommendations: [
      { id: 1, title: 'Intermediate Grammar Review', type: 'Lesson', level: 'B1' },
      { id: 2, title: 'Business English Phrases', type: 'Vocabulary', level: 'B2' },
      { id: 3, title: 'Conversation Practice', type: 'Speaking', level: 'B1' }
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* 1. Overview Section */}
        <section className="dash-overview">
          <div className="dash-greeting-card">
            <h1>Xin chào, {mockData.user.name}! 👋</h1>
            <p>Hãy tiếp tục hành trình học tập của bạn hôm nay</p>
          </div>

          <div className="dash-quick-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-icon">🔥</div>
              <div className="dash-stat-content">
                <div className="dash-stat-value">{mockData.user.streak} ngày</div>
                <div className="dash-stat-label">Chuỗi học liên tục</div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon">🎯</div>
              <div className="dash-stat-content">
                <div className="dash-stat-value">{mockData.dailyGoal.current}/{mockData.dailyGoal.target} phút</div>
                <div className="dash-stat-label">Mục tiêu hôm nay</div>
                <div className="dash-goal-progress-bar">
                  <div 
                    className="dash-goal-progress-fill" 
                    style={{ width: `${mockData.dailyGoal.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. Two Column Grid */}
        <div className="dash-grid-2col">
          {/* 3. Progress Section */}
          <section className="dash-progress">
            <h2 className="dash-section-title">📊 Tiến độ học tập</h2>
            <div className="dash-progress-stats">
              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-icon">✅</div>
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{mockData.stats.lessonsCompleted}</div>
                  <div className="dash-progress-stat-label">Bài học hoàn thành</div>
                </div>
              </div>

              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-icon">📝</div>
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{mockData.stats.vocabularyLearned}</div>
                  <div className="dash-progress-stat-label">Từ vựng đã học</div>
                </div>
              </div>
            </div>

            <div className="dash-skill-analysis">
              <h4>Phân tích kỹ năng</h4>
              <div className="dash-skill-item dash-skill-strong">
                <span className="dash-skill-icon">💪</span>
                <span>Điểm mạnh: {mockData.stats.strongSkills.join(', ')}</span>
              </div>
              <div className="dash-skill-item dash-skill-weak">
                <span className="dash-skill-icon">📈</span>
                <span>Cần cải thiện: {mockData.stats.weakSkills.join(', ')}</span>
              </div>
            </div>
          </section>

          {/* 4. Flashcard Section */}
          <section className="dash-flashcard">
            <h2 className="dash-section-title">🎴 Flashcard</h2>
            <div className="dash-flashcard-widget">
              <div className="dash-flashcard-icon-lg">🎴</div>
              <div className="dash-flashcard-count">{mockData.flashcards.dueToday}</div>
              <div className="dash-flashcard-label">thẻ cần ôn hôm nay</div>
              <div className="dash-flashcard-time">⏱️ Khoảng 5-10 phút</div>
              <button className="dash-btn-flashcard">Bắt đầu ôn tập →</button>
              <div className="dash-flashcard-total">Tổng: {mockData.flashcards.total} thẻ</div>
            </div>
          </section>
        </div>

        {/* 5. Schedule Section */}
        <section className="dash-schedule">
          <h2 className="dash-section-title">⏰ Lịch học & Nhắc nhở</h2>
          <div className="dash-schedule-info">
            <div className="dash-schedule-item">
              <div className="dash-schedule-icon">🔔</div>
              <div className="dash-schedule-content">
                <div className="dash-schedule-label">Nhắc nhở hàng ngày</div>
                <div className="dash-schedule-value">{mockData.learningSettings.reminderTime}</div>
              </div>
            </div>

            <div className="dash-schedule-item">
              <div className="dash-schedule-icon">📅</div>
              <div className="dash-schedule-content">
                <div className="dash-schedule-label">Mục tiêu tuần</div>
                <div className="dash-schedule-value">{mockData.learningSettings.daysPerWeek} ngày/tuần</div>
              </div>
            </div>
          </div>
          <button className="dash-btn-settings">⚙️ Cài đặt lịch học</button>
        </section>

        {/* 6. Achievements Section */}
        <section className="dash-achievements">
          <h2 className="dash-section-title">🏆 Thành tích</h2>
          <div className="dash-badges-grid">
            {mockData.badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`dash-badge-card ${badge.earned ? 'dash-badge-earned' : 'dash-badge-locked'}`}
              >
                {badge.earned && <div className="dash-badge-checkmark">✓</div>}
                <div className="dash-badge-icon-lg">{badge.icon}</div>
                <div className="dash-badge-name">{badge.name}</div>
                <div className="dash-badge-desc">{badge.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Recommendations Section */}
        <section className="dash-recommendations">
          <h2 className="dash-section-title">💡 Gợi ý cho bạn</h2>
          <div className="dash-rec-grid">
            {mockData.recommendations.map((rec) => (
              <div key={rec.id} className="dash-rec-card">
                <span className="dash-rec-badge">{rec.type}</span>
                <h3>{rec.title}</h3>
                <div className="dash-rec-level">
                  <span className="dash-level-icon">📊</span>
                  <span>Cấp độ: {rec.level}</span>
                </div>
                <button className="dash-btn-try">Thử ngay →</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
