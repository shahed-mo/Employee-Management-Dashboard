import React from 'react';

const policy = [
  'Employee contribution is 12% of basic salary, deducted monthly from payroll',
  'Employer matches with equal 12% contribution',
  'Total PF accumulation provides retirement security and emergency fund access',
];

const ProvidentPolicy = () => (
  <div className="card policy">
    <div className="card-header">
      <h4>About Provident Fund</h4>
    </div>
    <div className="card-content">
      {policy.map((text) => (
        <div key={text} className="flex">
          <div className="circle"></div>
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default React.memo(ProvidentPolicy);