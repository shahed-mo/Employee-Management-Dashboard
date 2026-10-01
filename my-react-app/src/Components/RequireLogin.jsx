import React from 'react';
import { Auth } from '../Context/Auth';
import { Navigate, useLocation } from 'react-router-dom';
import './spinner.css';

const RequireLogin = ({ children }) => {
  const { User, loading } = Auth();
  const location = useLocation();

  // استنى Firebase يرجّع الجلسة قبل ما تقرر
  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" role="status" aria-label="Loading"></div>
      </div>
    );
  }

  if (!User) {
    return <Navigate to="/auth" state={{ path: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default RequireLogin;