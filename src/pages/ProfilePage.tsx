import React from 'react';
import { ProfileBasicInfo } from '../components/profile/ProfileBasicInfo';
import { ProfileSecurity } from '../components/profile/ProfileSecurity';
import { ProfileSettings } from '../components/profile/ProfileSettings';
import '../styles/ProfilePage.css';

export const ProfilePage: React.FC = () => {

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-content-sections">
          <ProfileBasicInfo />
          <ProfileSecurity />
          <ProfileSettings />
        </div>
      </div>
    </div>
  );
};
