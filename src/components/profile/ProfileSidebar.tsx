import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileSidebar: React.FC = () => {
  const { user } = useAuth();

  // Mock data - sẽ được thay thế bằng data thực từ API
  const profileData = {
    avatar: user?.avatar || '/src/assets/logo.png',
    name: user?.username || 'John Doe',
    currentLevel: 'Intermediate – B1',
    progress: 65, // % progress to next level
    targetLevel: 'B2',
    totalHours: 124,
    completedCourses: 8,
    averageScore: 85
  };

  return (
    <div className="profile-sidebar-container">
      {/* Main Profile Card */}
      <div className="profile-card">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img src={profileData.avatar} alt={profileData.name} />
            <div className="avatar-status-dot"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="profile-info">
          <h2 className="profile-name">{profileData.name}</h2>
          <p className="profile-level">{profileData.currentLevel}</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-label">
            <span>Tiến độ tới {profileData.targetLevel}</span>
            <span className="progress-percentage">{profileData.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${profileData.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Edit Button */}
        <button className="edit-profile-btn">
          <span className="edit-icon">✏️</span>
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Stats Summary */}
      <div className="profile-stats-card">
        <h3 className="stats-title">Thống kê học tập</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{profileData.totalHours}</div>
              <div className="stat-label">Giờ học</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{profileData.completedCourses}</div>
              <div className="stat-label">Khóa học</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{profileData.averageScore}</div>
              <div className="stat-label">Điểm TB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};