import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAuth } from '../hooks/useAuth';
import { achievementService } from '../services/achievements';
import type { AchievementsResponse } from '../services/achievements';
import { getStudyChart } from '../services/studyService';
import type { StudyChartDataPoint } from '../services/studyService';
import { FaFire } from 'react-icons/fa';

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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
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
    weeklyGoal: {
      targetDays: 5,
      completedDays: 4,
      percentage: 80
    },
    studyTime: {
      today: 45,
      thisWeek: 180,
      thisMonth: 720
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
    recommendations: [
      { id: 1, title: 'Intermediate Grammar Review', type: 'Lesson', level: 'B1' },
      { id: 2, title: 'Business English Phrases', type: 'Vocabulary', level: 'B2' },
      { id: 3, title: 'Conversation Practice', type: 'Speaking', level: 'B1' }
    ]
  };

  // State management
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<AchievementsResponse>({
    achievementCompleteList: [],
    achievementProgressList: []
  });
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [chartData, setChartData] = useState<StudyChartDataPoint[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch achievements
        const achievementsData = await achievementService.getAchievements();
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }

      try {
        // Fetch chart data (returns array directly)
        const chartDataFromApi = await getStudyChart();
        
        if (chartDataFromApi && chartDataFromApi.length > 0) {
          setChartData(chartDataFromApi);
          
          // Find current week based on today's date
          const today = new Date();
          const currentDay = String(today.getDate()).padStart(2, '0');
          const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
          const todayStr = `${currentDay}/${currentMonth}`;
          
          // Find which week contains today
          const itemsPerWeek = 7;
          const totalWeeks = Math.ceil(chartDataFromApi.length / itemsPerWeek);
          
          for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
            const weekData = chartDataFromApi.slice(weekIndex * itemsPerWeek, (weekIndex + 1) * itemsPerWeek);
            const foundToday = weekData.some(item => item.day === todayStr);
            
            if (foundToday) {
              setSelectedWeek(weekIndex);
              break;
            }
          }
          
          // If today not found in data, default to last week (most recent)
          if (todayStr && !chartDataFromApi.some(item => item.day === todayStr)) {
            setSelectedWeek(totalWeeks - 1);
          }
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }

      setLoading(false);
      setLoadingChart(false);
    };

    fetchData();
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
            <h1>Xin chào, {mockData.user.name}!</h1>
            <p>Hãy tiếp tục hành trình học tập của bạn hôm nay</p>
          </div>

          <div className="dash-quick-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-icon-fire">
                <FaFire />
              </div>
              <div className="dash-stat-content">
                <div className="dash-stat-value">{mockData.user.streak} ngày</div>
                <div className="dash-stat-label">Chuỗi học liên tục</div>
              </div>
            </div>

            <div className="dash-stat-card">
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

            <div className="dash-stat-card">
              <div className="dash-stat-content">
                <div className="dash-stat-value">{mockData.weeklyGoal.completedDays}/{mockData.weeklyGoal.targetDays} ngày</div>
                <div className="dash-stat-label">Mục tiêu tuần này</div>
                <div className="dash-goal-progress-bar">
                  <div 
                    className="dash-goal-progress-fill" 
                    style={{ width: `${mockData.weeklyGoal.percentage}%` }}
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
            <h2 className="dash-section-title">Tiến độ học tập</h2>
            <div className="dash-progress-stats">
              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{mockData.stats.lessonsCompleted}</div>
                  <div className="dash-progress-stat-label">Bài học hoàn thành</div>
                </div>
              </div>

              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{mockData.stats.vocabularyLearned}</div>
                  <div className="dash-progress-stat-label">Từ vựng đã học</div>
                </div>
              </div>
            </div>

            {/* <div className="dash-skill-analysis">
              <h4>Phân tích kỹ năng</h4>
              <div className="dash-skill-item dash-skill-strong">
                <span className="dash-skill-icon">💪</span>
                <span>Điểm mạnh: {mockData.stats.strongSkills.join(', ')}</span>
              </div>
              <div className="dash-skill-item dash-skill-weak">
                <span className="dash-skill-icon">📈</span>
                <span>Cần cải thiện: {mockData.stats.weakSkills.join(', ')}</span>
              </div>
            </div> */}
          </section>

          {/* 4. Flashcard Section */}
          <section className="dash-flashcard">
            <h2 className="dash-section-title">🎴 Flashcard</h2>
            <div className="dash-flashcard-widget">
              <div className="dash-flashcard-icon-lg">🎴</div>
              <div className="dash-flashcard-count">{mockData.flashcards.dueToday}</div>
              <div className="dash-flashcard-label">thẻ cần ôn hôm nay</div>
              <div className="dash-flashcard-time">Khoảng 5-10 phút</div>
              <button className="dash-btn-flashcard">Bắt đầu ôn tập →</button>
              <div className="dash-flashcard-total">Tổng: {mockData.flashcards.total} thẻ</div>
            </div>
          </section>
        </div>

        {/* Study Time Statistics */}
        <section className="dash-study-time">
          <h2 className="dash-section-title">Thống kê thời gian học</h2>
          <div className="dash-time-stats">
            <div className="dash-time-card">
              <div className="dash-time-label">Hôm nay</div>
              <div className="dash-time-value">{mockData.studyTime.today} phút</div>
            </div>
            <div className="dash-time-card">
              <div className="dash-time-label">Tuần này</div>
              <div className="dash-time-value">{mockData.studyTime.thisWeek} phút</div>
            </div>
            <div className="dash-time-card">
              <div className="dash-time-label">Tháng này</div>
              <div className="dash-time-value">{mockData.studyTime.thisMonth} phút</div>
            </div>
          </div>
        </section>

        {/* Learning Chart */}
        <section className="dash-chart">
          <div className="dash-chart-header">
            <h2 className="dash-section-title">Biểu đồ học tập</h2>
            <div className="dash-chart-select-wrapper">
              <select 
                className="dash-chart-select"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
              >
                {[0, 1, 2, 3].map((weekIndex) => {
                  const weekData = chartData.slice(weekIndex * 7, (weekIndex + 1) * 7);
                  const startDate = weekData[0]?.day || '?';
                  const endDate = weekData[weekData.length - 1]?.day || '?';
                  return (
                    <option key={weekIndex} value={weekIndex}>
                      Tuần {weekIndex + 1} ({startDate} - {endDate})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {loadingChart ? (
            <div className="dash-chart-loading">
              <div className="dash-loading-spinner"></div>
              <p>Đang tải biểu đồ...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="dash-chart-empty">
              <p>Chưa có dữ liệu học tập</p>
            </div>
          ) : (() => {
            const weekData = chartData.slice(selectedWeek * 7, (selectedWeek + 1) * 7);
            const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1); // Ensure at least 1 to avoid division by 0
            
            return (
              <div className="dash-chart-container">
                <div className="dash-chart-grid">
                  {weekData.map((data, index) => {
                    const heightPx = (data.minutes / maxMinutes) * 220;
                    return (
                      <div key={index} className="dash-chart-bar-wrapper">
                        <div className="dash-chart-bar-container">
                          <div 
                            className="dash-chart-bar" 
                            style={{ height: `${heightPx}px` }}
                          >
                            <span className="dash-chart-value">{data.minutes}</span>
                          </div>
                        </div>
                        <div className="dash-chart-label">{data.day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          
          <div className="dash-chart-footer">
            <span>Thời gian học (phút)</span>
          </div>
        </section>

      

        {/* 6. Achievements Section */}
        <section className="dash-achievements">
          <h2 className="dash-section-title">Thành tích</h2>
          
          {/* Completed Achievements */}
          {achievements.achievementCompleteList.length > 0 && (
            <div className="dash-achievement-section">
              <h3 className="dash-achievement-subtitle">Đã hoàn thành</h3>
              <div className="dash-badges-grid">
                {achievements.achievementCompleteList.map((achievement) => (
                  <div key={achievement.achievementId} className="dash-badge-card dash-badge-earned">
                    <div className="dash-badge-checkmark">✓</div>
                    <img src={achievement.iconUrl} alt={achievement.achievementName} className="dash-badge-icon-img" />
                    <div className="dash-badge-name">{achievement.achievementName}</div>
                    <div className="dash-badge-progress-complete">
                      {achievement.currentValue}/{achievement.targetValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Achievements */}
          {achievements.achievementProgressList.length > 0 && (
            <div className="dash-achievement-section">
              <h3 className="dash-achievement-subtitle">Đang thực hiện</h3>
              <div className="dash-badges-grid">
                {achievements.achievementProgressList
                  .slice(0, showAllAchievements ? achievements.achievementProgressList.length : 10)
                  .map((achievement) => {
                    const progress = (achievement.currentValue / achievement.targetValue) * 100;
                    return (
                      <div key={achievement.achievementId} className="dash-badge-card dash-badge-progress">
                        <img src={achievement.iconUrl} alt={achievement.achievementName} className="dash-badge-icon-img" />
                        <div className="dash-badge-name">{achievement.achievementName}</div>
                        <div className="dash-badge-progress-bar">
                          <div className="dash-badge-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="dash-badge-progress-text">
                          {achievement.currentValue}/{achievement.targetValue}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {achievements.achievementProgressList.length > 10 && (
                <div className="dash-achievement-toggle">
                  <button 
                    className="dash-btn-toggle-achievements"
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                  >
                    {showAllAchievements ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
