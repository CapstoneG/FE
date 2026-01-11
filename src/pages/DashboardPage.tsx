import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAuth } from '../hooks/useAuth';
import { achievementService } from '../services/achievements';
import type { AchievementsResponse } from '../services/achievements';
import { getStudyChart } from '../services/studyService';
import type { StudyChartDataPoint } from '../services/studyService';
import { userService } from '../services/userService';
import type { UserDashboard } from '../services/userService';
import { FaFire } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
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
        // Fetch dashboard data
        const dashboardData = await userService.getDashboard();
        setDashboard(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }

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

  if (loading || !dashboard) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const dailyGoalPercentage = dashboard.targetDailyStudied > 0 
    ? Math.round((dashboard.timeStudyToday / dashboard.targetDailyStudied) * 100) 
    : 0;
  const activeDays = dashboard.activityData?.filter(d => d.lessons > 0 || d.flashcards > 0 || d.skills > 0).length || 0;
  const weeklyGoalPercentage = dashboard.targetDaysPerW > 0
    ? Math.round((activeDays / dashboard.targetDaysPerW) * 100)
    : 0;

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* 1. Overview Section */}
        <section className="dash-overview">
          <div className="dash-greeting-card">
            <h1>Xin chào, {user?.fullName || user?.username || 'Learner'}!</h1>
            <p>Hãy tiếp tục hành trình học tập của bạn hôm nay</p>
          </div>

          <div className="dash-quick-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-icon-fire">
                <FaFire />
              </div>
              <div className="dash-stat-content">
                <div className="dash-stat-value">{dashboard.streakDays} ngày</div>
                <div className="dash-stat-label">Chuỗi học liên tục</div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-content">
                <div className="dash-stat-value">{dashboard.timeStudyToday}/{dashboard.targetDailyStudied} phút</div>
                <div className="dash-stat-label">Mục tiêu hôm nay</div>
                <div className="dash-goal-progress-bar">
                  <div 
                    className="dash-goal-progress-fill" 
                    style={{ width: `${dailyGoalPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-content">
                <div className="dash-stat-value">{activeDays}/{dashboard.targetDaysPerW} ngày</div>
                <div className="dash-stat-label">Mục tiêu tuần này</div>
                <div className="dash-goal-progress-bar">
                  <div 
                    className="dash-goal-progress-fill" 
                    style={{ width: `${weeklyGoalPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress and Study Time - 2 Column Grid */}
        <div className="dash-grid-2col">
          <section className="dash-progress">
            <h2 className="dash-section-title">Tiến độ học tập</h2>
            <div className="dash-progress-stats">
              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{dashboard.lessonComplete}</div>
                  <div className="dash-progress-stat-label">Bài học hoàn thành</div>
                </div>
              </div>

              <div className="dash-progress-stat-item">
                <div className="dash-progress-stat-content">
                  <div className="dash-progress-stat-value">{dashboard.flashcardsStudied}</div>
                  <div className="dash-progress-stat-label">Flashcards đã học</div>
                </div>
              </div>
            </div>
          </section>

          <section className="dash-study-time">
            <h2 className="dash-section-title">Thống kê thời gian học</h2>
            <div className="dash-time-stats">
              <div className="dash-time-card">
                <div className="dash-time-label">Hôm nay</div>
                <div className="dash-time-value">{dashboard.timeStudyToday} phút</div>
              </div>
              <div className="dash-time-card">
                <div className="dash-time-label">Tuần này</div>
                <div className="dash-time-value">{dashboard.timeStudyW} phút</div>
              </div>
              <div className="dash-time-card">
                <div className="dash-time-label">Tháng này</div>
                <div className="dash-time-value">{dashboard.timeStudyM} phút</div>
              </div>
            </div>
          </section>
        </div>

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

        {/* Activity Charts - 2 Column Grid */}
        <div className="dash-grid-2col">
          <section className="dash-chart">
            <div className="chart-card">
              <h3>Hoạt động tuần này</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboard.activityData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="flashcards" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      name="Flashcards"
                      dot={{ fill: '#667eea', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lessons" 
                      stroke="#f5576c" 
                      strokeWidth={3}
                      name="Bài học"
                      dot={{ fill: '#f5576c', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="skills" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="Kỹ năng"
                      dot={{ fill: '#f59e0b', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="dash-chart">
            <div className="chart-card">
              <h3>Hoạt động theo kỹ năng</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboard.activityDataSkill || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      angle={-15}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="times" 
                      fill="#667eea" 
                      name="Thời gian (phút)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

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
