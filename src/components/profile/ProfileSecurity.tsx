import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { Toast } from '../common/Toast';

export const ProfileSecurity: React.FC = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isOAuthUser = user?.provider === 'GOOGLE';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate client-side
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setToast({ message: 'Mật khẩu phải có ít nhất 8 ký tự!', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await userService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      // Handle different response codes
      if (result.code === 1000) {
        setToast({ message: 'Đổi mật khẩu thành công!', type: 'success' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowChangePassword(false);
      } else if (result.code === 1012) {
        setToast({ message: 'Mật khẩu cũ không đúng!', type: 'error' });
      } else if (result.code === 1013) {
        setToast({ message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      } else if (result.code === 1001) {
        setToast({ message: 'Mật khẩu không đủ 8 ký tự!', type: 'error' });
      } else {
        setToast({ message: result.message || 'Có lỗi khi đổi mật khẩu!', type: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setToast({ message: 'Có lỗi khi đổi mật khẩu. Vui lòng thử lại.', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deactivateAccount();
      
      setToast({ message: 'Tài khoản của bạn đã được vô hiệu hóa thành công!', type: 'success' });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error deleting account:', error);
      setToast({ message: 'Có lỗi khi xóa tài khoản. Vui lòng thử lại.', type: 'error' });
      setShowDeleteConfirm(false);
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
                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
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
                  <button 
                    type="submit" 
                    className="btn btn-save"
                    disabled={isChangingPassword}
                    style={{ opacity: isChangingPassword ? 0.6 : 1, cursor: isChangingPassword ? 'not-allowed' : 'pointer' }}
                  >
                    {isChangingPassword ? 'Đang xử lý...' : 'Lưu mật khẩu'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-cancel"
                    onClick={() => setShowChangePassword(false)}
                    disabled={isChangingPassword}
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
              <h3>Vô hiệu hóa tài khoản</h3>
              <p>Khóa tài khoản và ngừng truy cập vào hệ thống</p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button 
              className="btn btn-danger btn-delete-account"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Yêu cầu vô hiệu hóa
            </button>
          ) : (
            <div className="delete-confirm">
              <div className="warning-message">
                <div>
                  <strong>Bạn có chắc chắn muốn vô hiệu hóa tài khoản không?</strong>
                  <p style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    Tài khoản của bạn sẽ bị khóa ngay lập tức và bạn sẽ không thể đăng nhập vào hệ thống.
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Sau 30 ngày kể từ thời điểm vô hiệu hóa, nếu không có yêu cầu khôi phục:</strong>
                  </p>
                  <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem' }}>
                    <li>Tài khoản sẽ bị xóa vĩnh viễn</li>
                    <li>Toàn bộ dữ liệu liên quan có thể không thể khôi phục</li>
                  </ul>
                  <p style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
                    Trong thời gian 30 ngày này, nếu bạn muốn kích hoạt lại tài khoản, vui lòng liên hệ với quản trị viên để được hỗ trợ.
                  </p>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  <span>✓</span> Xác nhận vô hiệu hóa
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
