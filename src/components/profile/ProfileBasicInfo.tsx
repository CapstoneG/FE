import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadService } from '../../services/uploadService';
import { Toast } from '../common/Toast';

export const ProfileBasicInfo: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [newAvatarPublicId, setNewAvatarPublicId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Kiểm tra xem user có login qua OAuth không
  const isOAuthUser = user?.provider === 'GOOGLE';
  const canEditEmail = !isOAuthUser;

  // Format ngày tham gia
  const formatJoinDate = (date: string | undefined) => {
    if (!date) return 'Chưa rõ';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Cập nhật thông tin cơ bản
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      
      // Thêm avatarUrl nếu có ảnh mới
      if (newAvatarUrl) {
        updateData.avatarUrl = newAvatarUrl;
      }
      
      await updateProfile(updateData);
      
      setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
      
      setIsEditing(false);
      setAvatarPreview(null);
      setNewAvatarUrl(null);
      setNewAvatarPublicId(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ message: 'Có lỗi khi cập nhật thông tin. Vui lòng thử lại.', type: 'error' });
    }
  };

  const handleCancel = async () => {
    if (newAvatarPublicId) {
      try {
        await uploadService.deleteImage(newAvatarPublicId);
      } catch (error) {
        console.error('Failed to delete temporary image:', error);
      }
    } else {
      console.log('No avatar to delete');
    }
    
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
    });
    setAvatarPreview(null);
    setNewAvatarUrl(null);
    setNewAvatarPublicId(null);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      console.log('Avatar clicked, opening file picker...');
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(true);
      const uploadResult = await uploadService.uploadImage(file);
      setIsUploading(false);

      if (uploadResult) {
        setNewAvatarUrl(uploadResult.url);
        setNewAvatarPublicId(uploadResult.publicId);
      } else {
        setAvatarPreview(null);
      }
    }
  };

  return (
    <div className="profile-basic-info">
      <div className="section-header">
        <h2>Thông tin cơ bản</h2>
        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          Chỉnh sửa
        </button>
      </div>

      <div className="info-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={avatarPreview || user?.avatar || user?.avatarUrl || '/src/assets/logo.png'} 
              alt={user?.username || 'User'} 
              className="profile-avatar"
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
              onClick={handleAvatarClick}
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
          {isEditing && (
            <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click vào ảnh để thay đổi
            </p>
          )}
        </div>

        {/* User Information */}
        <div className="info-fields">
          {/* Họ và Tên */}
          <div className="info-field">
            <label>Họ và tên</label>
            {isEditing ? (
              <div className="name-inputs">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Họ"
                  className="input-field"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tên"
                  className="input-field"
                />
              </div>
            ) : (
              <div className="field-value">
                {user?.firstName} {user?.lastName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="info-field">
            <label>Email</label>
            <div className="field-value">
              {user?.email}
              {isOAuthUser && (
                <span className="badge oauth-badge">
                  {user.provider === 'GOOGLE' ? '🔗 Google' : '🔗 Facebook'}
                </span>
              )}
              {!isOAuthUser && (
                <span className="badge verified-badge">
                  Đã xác minh
                </span>
              )}
            </div>
            {canEditEmail && !isEditing && (
              <small className="field-note">Bạn có thể xác minh lại email</small>
            )}
          </div>


          {/* Ngày tham gia */}
          <div className="info-field">
            <label>Ngày tham gia</label>
            <div className="field-value">
              {formatJoinDate(user?.createdAt)}
            </div>
          </div>

          {/* Vai trò */}
          <div className="info-field">
            <label>Vai trò</label>
            <div className="field-value">
              <span className="badge role-badge">
                Học viên
              </span>
              {user?.roles && user.roles.length > 0 && (
                user.roles.map((role, index) => (
                  <span key={index} className="badge role-badge admin-badge">
                    {role.name.toLowerCase()}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="action-buttons">
            <button className="btn btn-save" onClick={handleSave}>
              Lưu thay đổi
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        )}
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
