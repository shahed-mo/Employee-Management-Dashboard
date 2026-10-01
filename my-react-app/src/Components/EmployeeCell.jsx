import React from 'react';

export const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('');

const EmployeeCell = ({ name, fallback = 'Unknown' }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <span className="inital">{getInitials(name) || '--'}</span>
    {name || fallback}
  </div>
);

export default EmployeeCell;