import React from 'react';

const statusClasses = {
  'pending requests': 'pending',
  'approved': 'approved',
  'rejected': 'rejected',
  'absent': 'absent',
  'present': 'present',
  'half day': 'halfday',
  'total hours': 'total',
};

const RequestStatus = ({ request = '', number, icon }) => {
  const key = String(request).toLowerCase();

  return (
    <div className={`card ${statusClasses[key] || ''}`}>
      <div className="card-content">
        <div className="card-flex">
          <div>
            <p className="request">{request}</p>
            <p className="num">{number}</p>
          </div>
          <div className="icon">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatus;