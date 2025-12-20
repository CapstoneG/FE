import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileSecurity: React.FC = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isOAuthUser = user?.provider === 'GOOGLE';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      // TODO: Gọi API đổi mật khẩu
      // await authService.changePassword(passwordData);
      alert('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Có lỗi khi đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  const handleDeleteAccount = async () => {

    try {
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="profile-security">
      <div className="section-header">
        <h2>Bảo mật và quyền riêng tư</h2>
      </div>

      <div className="security-content">
        {/* Đổi mật khẩu - chỉ cho tài khoản email/password */}
        {!isOAuthUser && (
          <div className="security-section password-section">
            <div className="security-section-header">
              <div className="section-info">
                <h3>Đổi mật khẩu</h3>
                <p>Cập nhật mật khẩu của bạn để bảo mật tài khoản</p>
              </div>
            </div>
            
            {!showChangePassword ? (
              <button 
                className="btn btn-primary btn-change-password"
                onClick={() => setShowChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
            ) : (
              <form onSubmit={handleSubmitPasswordChange} className="password-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input-field"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input-field"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input-field"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-save">
                    Lưu mật khẩu
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-cancel"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Xóa tài khoản */}
        <div className="security-section danger-zone">
          <div className="security-section-header">
            <div className="section-info">
              <h3>Xóa tài khoản</h3>
              <p>Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn</p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button 
              className="btn btn-danger btn-delete-account"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Yêu cầu xóa tài khoản
            </button>
          ) : (
            <div className="delete-confirm">
              <div className="warning-message">
                <div>
                  <strong>Cảnh báo nghiêm trọng!</strong>
                  <p>Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu học tập, tiến độ và thông tin cá nhân sẽ bị xóa vĩnh viễn và không thể khôi phục!</p>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  <span>✓</span> Xác nhận xóa
                </button>
                <button 
                  className="btn btn-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <span>✕</span> Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
