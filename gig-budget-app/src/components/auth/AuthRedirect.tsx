import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  
  useEffect(() => {
    // If user is already logged in and tries to access login page,
    // redirect them to the dashboard
    if (user && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [user, location.pathname, navigate]);
  
  return <>{children}</>;
};

export default AuthRedirect; 