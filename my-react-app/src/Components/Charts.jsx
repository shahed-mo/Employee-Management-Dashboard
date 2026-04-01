import React from 'react'

const Charts = ({ cardtitle, icon, children, color }) => {
  return (
    <div className='card'>
      <div className="card_header">
        <h4 className='icon-title' style={{ fill: color }}>
          {icon}
        </h4>
        <h4>{cardtitle}</h4> 
      </div>

      <div className="card-content">
        <div className="recharts-responsive-container">
          <div className="recharts-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts