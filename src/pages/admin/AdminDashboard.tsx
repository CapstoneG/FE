import React, { useState, useEffect } from 'react';
import '@/styles/admin/AdminDashboard.css';
import { FaUsers, FaBook, FaChartLine, FaCog, FaSignOutAlt, FaFileAlt, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CourseManagement from './CourseManagement';
import UnitManagement from './UnitManagement';
import LessonManagement from './LessonManagement';
import type { Unit, Course } from '@/types/admin';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  activeUsers: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Fetch admin stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data for demo
      setStats({
        totalUsers: 1250,
        totalCourses: 24,
        totalLessons: 180,
        activeUsers: 456
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>📚 EngHub Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine /> Tổng quan
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Người dùng
          </button>
          <button
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('courses');
              setSelectedCourse(null);
              setSelectedUnit(null);
            }}
          >
            <FaBook /> Khóa học
          </button>
          <button
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <FaComments /> Phản hồi
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Cài đặt
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Bảng điều khiển quản trị</h1>
          <div className="admin-user">
            <span>Xin chào, Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon users">
                    <FaUsers size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>Tổng người dùng</h3>
                    <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
                    <span className="stat-change positive">+12% so với tháng trước</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon courses">
                    <FaBook size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>Tổng khóa học</h3>
                    <p className="stat-number">{stats.totalCourses}</p>
                    <span className="stat-change positive">+2 khóa học mới</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon lessons">
                    <FaFileAlt size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>Tổng bài học</h3>
                    <p className="stat-number">{stats.totalLessons}</p>
                    <span className="stat-change neutral">Ổn định</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon active">
                    <FaChartLine size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>Người dùng hoạt động</h3>
                    <p className="stat-number">{stats.activeUsers}</p>
                    <span className="stat-change positive">+8% hôm nay</span>
                  </div>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>📊 Hoạt động gần đây</h3>
                  <p className="placeholder">Biểu đồ thống kê người dùng theo thời gian</p>
                </div>
                <div className="chart-card">
                  <h3>📈 Khóa học phổ biến</h3>
                  <p className="placeholder">Biểu đồ khóa học được học nhiều nhất</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>Quản lý người dùng</h2>
                <button className="add-btn">+ Thêm người dùng</button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Ngày tham gia</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Nguyễn Văn A</td>
                      <td>nguyenvana@email.com</td>
                      <td><span className="role-badge user">Học viên</span></td>
                      <td>01/01/2024</td>
                      <td><span className="status-badge active">Hoạt động</span></td>
                      <td>
                        <button className="action-btn edit">Sửa</button>
                        <button className="action-btn delete">Xóa</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              {selectedUnit ? (
                <LessonManagement 
                  unit={selectedUnit} 
                  onBack={() => setSelectedUnit(null)} 
                />
              ) : selectedCourse ? (
                <UnitManagement 
                  course={selectedCourse}
                  onSelectUnit={setSelectedUnit}
                  onBack={() => setSelectedCourse(null)}
                />
              ) : (
                <CourseManagement onSelectCourse={setSelectedCourse} />
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="feedback-section">
              <div className="section-header">
                <h2>Phản hồi từ người dùng</h2>
              </div>
              <p className="placeholder">Danh sách phản hồi sẽ hiển thị ở đây</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Cài đặt hệ thống</h2>
              </div>
              <div className="settings-form">
                <div className="form-group">
                  <label>Tên website</label>
                  <input type="text" defaultValue="EngHub" />
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <input type="email" defaultValue="contact@enghub.com" />
                </div>
                <button className="save-btn">Lưu thay đổi</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
