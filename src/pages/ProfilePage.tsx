import React from 'react';
import './ProfilePage.css';

// Import profile components trực tiếp
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { ProfileDashboard } from '../components/profile/ProfileDashboard';
import { ProfileAchievements } from '../components/profile/ProfileAchievements';

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Sidebar - Profile Info */}
        <div className="profile-sidebar">
          <ProfileSidebar />
        </div>

        {/* Center - Dashboard */}
        <div className="profile-main">
          <ProfileDashboard />
        </div>

        {/* Right - Achievements & Suggestions */}
        <div className="profile-achievements">
          <ProfileAchievements />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;