import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface UserProfile {
  email: string;
  name: string;
  profileUrl: string;
}

const GoogleUserInfo: React.FC = () =>{
  const accessToken = Cookies.get('access_token_g');  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { email, name, picture: profileUrl } = response.data;

        setUserProfile({ email, name, profileUrl });
      } catch (err) {
        setError('Failed to fetch user profile');
      }
    };

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
<div className="max-w-sm w-full bg-white bg-opacity-10 border border-gray-300 rounded-lg shadow-md p-5 text-center mx-auto">
  {userProfile ? (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <img 
          src={userProfile.profileUrl} 
          alt="Profile" 
          className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover" // Optional border
        />
      </div>
      <div>
        <p className="my-1 text-lg font-semibold"><strong>Name:</strong> {userProfile.name}</p>
        <p className="my-1 text-lg font-semibold"><strong>Email:</strong> {userProfile.email}</p>
      </div>
    </div>
  ) : (
    <p>Loading user profile...</p>
  )}
</div>

  );
};

export default GoogleUserInfo;