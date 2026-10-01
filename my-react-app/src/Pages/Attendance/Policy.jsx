import React from 'react';

const Policy = ({ title = 'Policy', par }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>

      <div className="card-content">
        <div className="flex">{par && <p>{par}</p>}</div>
      </div>
    </div>
  );
};

export default Policy;