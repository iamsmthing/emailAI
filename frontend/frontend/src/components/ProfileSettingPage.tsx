import React from 'react';
import { SettingsComponent } from '../pages/Dashboard';
import GoogleUserInfo from './Profile';

const ProfileSettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 p-6">
      {/* Settings Component */}
      <div className="lg:w-1/2 w-full">
        <SettingsComponent />
      </div>

      {/* User Profile Component */}
      <div className="lg:w-1/2 w-full">
        <GoogleUserInfo />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
