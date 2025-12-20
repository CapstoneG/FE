import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

interface SettingsData {
  dailyStudyReminder: boolean;
  reminderTime: string;
  dailyStudyMinutes: number;
  targetDaysPerWeek: number;
  emailNotification: boolean;
}

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    dailyStudyReminder: false,
    reminderTime: '20:00',
    dailyStudyMinutes: 15,
    targetDaysPerWeek: 5,
    emailNotification: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.learningSettings) {
      const timeValue = user.learningSettings.reminderTime?.substring(0, 5) || '20:00';
      
      setSettings({
        dailyStudyReminder: user.learningSettings.dailyStudyReminder,
        reminderTime: timeValue,
        dailyStudyMinutes: user.learningSettings.dailyStudyMinutes,
        targetDaysPerWeek: user.learningSettings.targetDaysPerWeek,
        emailNotification: user.learningSettings.emailNotification,
      });
    }
  }, [user]);


  const handleToggle = (field: keyof SettingsData) => {
    setSettings({
      ...settings,
      [field]: !settings[field]
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      reminderTime: e.target.value
    });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      dailyStudyMinutes: parseInt(e.target.value)
    });
  };

  const handleTargetDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      targetDaysPerWeek: parseInt(e.target.value)
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = {
        dailyStudyReminder: settings.dailyStudyReminder,
        reminderTime: settings.reminderTime + ':00',
        emailNotification: settings.emailNotification,
        dailyStudyMinutes: settings.dailyStudyMinutes,
        targetDaysPerWeek: settings.targetDaysPerWeek,
      };

      await userService.updateLearningSettings(settingsToSave);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="section-header">
        <h2>Cài đặt</h2>
      </div>

      <div className="settings-content">


        {/* Nhắc học hàng ngày */}
        <div className="settings-section">
          <div className="section-title">
            <h3>Nhắc nhở học tập</h3>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <label>Nhắc học hàng ngày</label>
              <p className="setting-description">
                Nhận thông báo nhắc nhở học tập mỗi ngày
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.dailyStudyReminder}
                onChange={() => handleToggle('dailyStudyReminder')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Reminder Time */}
          {settings.dailyStudyReminder && (
            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="reminderTime">Thời gian nhắc nhở</label>
                <p className="setting-description">
                  Chọn thời gian bạn muốn nhận nhắc nhở học tập
                </p>
              </div>
              <input
                type="time"
                id="reminderTime"
                value={settings.reminderTime}
                onChange={handleTimeChange}
                className="input-field time-input"
              />
            </div>
          )}

          {/* Email Notifications */}
          <div className="setting-item">
            <div className="setting-label">
              <label>Thông báo qua Email</label>
              <p className="setting-description">
                Nhận thông báo về tiến độ học tập qua email
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotification}
                onChange={() => handleToggle('emailNotification')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

        </div>

        {/* Mục tiêu học tập */}
        <div className="settings-section">
          <div className="section-title">
            <h3>Mục tiêu học tập</h3>
          </div>
          
          <div className="goal-selection">
            <label htmlFor="dailyGoal" className="goal-label">
              Thời gian học mỗi ngày
            </label>
            <select
              id="dailyGoal"
              value={settings.dailyStudyMinutes}
              onChange={handleGoalChange}
              className="select-field goal-select"
            >
              <option value="15">15 phút/ngày - Thường xuyên</option>
              <option value="30">30 phút/ngày - Chuyên cần</option>
              <option value="45">45 phút/ngày - Tích cực</option>
              <option value="60">60 phút/ngày - Quyết tâm</option>
            </select>
          </div>

          <div className="goal-selection">
            <label htmlFor="targetDays" className="goal-label">
              Số ngày học mỗi tuần
            </label>
            <select
              id="targetDays"
              value={settings.targetDaysPerWeek}
              onChange={handleTargetDaysChange}
              className="select-field goal-select"
            >
              <option value="3">3 ngày/tuần</option>
              <option value="4">4 ngày/tuần</option>
              <option value="5">5 ngày/tuần</option>
              <option value="6">6 ngày/tuần</option>
              <option value="7">7 ngày/tuần</option>
            </select>
          </div>

          <div className="goal-preview-cards">
            <div className="goal-card">
              <div className="goal-card-content">
                <p className="goal-card-label">Mục tiêu tuần</p>
                <p className="goal-card-value">{settings.dailyStudyMinutes * settings.targetDaysPerWeek} phút</p>
                <p className="goal-card-sublabel">{Math.round((settings.dailyStudyMinutes * settings.targetDaysPerWeek) / 60 * 10) / 10} giờ</p>
              </div>
            </div>
            <div className="goal-card">
              <div className="goal-card-content">
                <p className="goal-card-label">Mục tiêu tháng</p>
                <p className="goal-card-value">{settings.dailyStudyMinutes * 30} phút</p>
                <p className="goal-card-sublabel">{Math.round((settings.dailyStudyMinutes * 30) / 60 * 10) / 10} giờ</p>
              </div>
            </div>
          </div>

          <div className="goal-tip">
            <p className="tip-text">
              Mẹo: Bắt đầu với mục tiêu nhỏ và tăng dần theo thời gian
            </p>
          </div>
        </div>

        <div className="settings-actions">
          <button 
            className="btn btn-primary btn-save-settings"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>
    </div>
  );
};
