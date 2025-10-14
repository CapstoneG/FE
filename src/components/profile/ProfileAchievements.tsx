import React from 'react';

export const ProfileAchievements: React.FC = () => {
  // Mock data cho achievements, suggestions, và notifications
  const achievements = [
    {
      id: 1,
      icon: '🥇',
      title: 'Hoàn thành 10 bài học liên tiếp',
      description: 'Bạn đã học liên tục 10 bài không nghỉ!',
      unlockedDate: '2024-10-05',
      rarity: 'gold'
    },
    {
      id: 2,
      icon: '🏅',
      title: 'Học 7 ngày liên tục',
      description: 'Streak học tập ấn tượng!',
      unlockedDate: '2024-10-03',
      rarity: 'silver'
    },
    {
      id: 3,
      icon: '🎯',
      title: 'Điểm số hoàn hảo',
      description: 'Đạt 100% trong bài kiểm tra',
      unlockedDate: '2024-09-28',
      rarity: 'gold'
    },
    {
      id: 4,
      icon: '📚',
      title: 'Thư viện tri thức',
      description: 'Hoàn thành 5 khóa học',
      unlockedDate: '2024-09-20',
      rarity: 'bronze'
    }
  ];

  const suggestions = [
    {
      id: 1,
      type: 'course',
      title: 'English Conversation Basics',
      reason: 'Cải thiện kỹ năng Speaking (65/100)',
      image: '/src/assets/bk.jpg',
      difficulty: 'Beginner',
      duration: '4 tuần'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Daily Listening Practice',
      reason: 'Tăng cường kỹ năng Listening',
      image: '/src/assets/bk.jpg',
      difficulty: 'Intermediate',
      duration: '15 phút/ngày'
    },
    {
      id: 3,
      type: 'grammar',
      title: 'Advanced Grammar',
      reason: 'Hoàn thiện ngữ pháp nâng cao',
      image: '/src/assets/bk.jpg',
      difficulty: 'Advanced',
      duration: '6 tuần'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'teacher',
      sender: 'Ms. Sarah Johnson',
      message: 'Chúc mừng em đã hoàn thành xuất sắc bài kiểm tra Speaking!',
      time: '2 giờ trước',
      avatar: '/src/assets/logo.png',
      unread: true
    },
    {
      id: 2,
      type: 'system',
      sender: 'Hệ thống',
      message: 'Khóa học mới "Business English Advanced" đã được cập nhật',
      time: '1 ngày trước',
      avatar: '/src/assets/logo.png',
      unread: true
    },
    {
      id: 3,
      type: 'reminder',
      sender: 'Nhắc nhở học tập',
      message: 'Đừng quên làm bài tập hàng ngày để duy trì streak!',
      time: '2 ngày trước',
      avatar: '/src/assets/logo.png',
      unread: false
    }
  ];

  return (
    <div className="profile-achievements">
      {/* Achievements Section */}
      <div className="achievements-section">
        <div className="section-header">
          <h3>🏆 Thành tích</h3>
          <button className="view-all-btn">Xem tất cả</button>
        </div>
        <div className="achievements-list">
          {achievements.slice(0, 4).map((achievement) => (
            <div key={achievement.id} className={`achievement-item ${achievement.rarity}`}>
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-content">
                <h4 className="achievement-title">{achievement.title}</h4>
                <p className="achievement-description">{achievement.description}</p>
                <span className="achievement-date">
                  {new Date(achievement.unlockedDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Suggestions Section */}
      <div className="suggestions-section">
        <div className="section-header">
          <h3>💡 Gợi ý cho bạn</h3>
        </div>
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="suggestion-card">
              <div className="suggestion-image">
                <img src={suggestion.image} alt={suggestion.title} />
                <div className="suggestion-type">
                  {suggestion.type === 'course' && '📚'}
                  {suggestion.type === 'practice' && '🎧'}
                  {suggestion.type === 'grammar' && '✍️'}
                </div>
              </div>
              <div className="suggestion-content">
                <h4 className="suggestion-title">{suggestion.title}</h4>
                <p className="suggestion-reason">{suggestion.reason}</p>
                <div className="suggestion-meta">
                  <span className="difficulty">{suggestion.difficulty}</span>
                  <span className="duration">{suggestion.duration}</span>
                </div>
                <button className="try-now-btn">Thử ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <div className="section-header">
          <h3>🔔 Thông báo</h3>
          <button className="mark-all-read-btn">Đánh dấu đã đọc</button>
        </div>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
              <div className="notification-avatar">
                <img src={notification.avatar} alt={notification.sender} />
                {notification.unread && <div className="unread-dot"></div>}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-sender">{notification.sender}</span>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="view-all-notifications-btn">
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
};