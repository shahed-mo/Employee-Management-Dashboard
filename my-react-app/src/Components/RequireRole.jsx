import React from 'react';
import { Auth } from '../Context/Auth';
import './spinner.css';

const styles = {
  denied: {
    color: '#FF0000',
    display: 'flex',
    height: '50vh',
    fontWeight: '700',
    fontSize: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const RequireRole = ({ role, children }) => {
  const { User, loading } = Auth();

  // استنى Firebase يرجّع الجلسة قبل ما تحكم
  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" role="status" aria-label="Loading"></div>
      </div>
    );
  }

  if (!User) {
    return <div style={styles.denied}>Access Denied !</div>;
  }

  const allowed = Array.isArray(role) ? role : [role];
  const userRole = String(User.role || '').toLowerCase();
  const isAuthorized = allowed.some((r) => String(r).toLowerCase() === userRole);

  if (!isAuthorized) {
    return <div style={styles.denied}>Access Denied !</div>;
  }

  return <>{children}</>;
};

export default RequireRole;