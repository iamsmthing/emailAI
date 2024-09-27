import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Check if 'access_token_g' is present in the cookies
  const token = Cookies.get('access_token_g');

  // If the token is not present, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the token exists, render the child components (protected route)
  return <>{children}</>;
};

export default AuthGuard;
