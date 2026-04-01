import React from 'react'

const RequestStatus = ({ request, number, icon }) => {

  const statusClasses = {
    'pending requests': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
    'absent': 'absent',
    'present': 'present',
    'half day': 'halfday',
    'total hours': 'total'
  }

  const key = request.toLowerCase();

  return (
    <div className={`card ${statusClasses[key] || ''}`}>
        <div className="card-content">
            <div className="card-flex">
                <div>
                    <p className='request'>{request}</p>
                    <p className='num'>{number}</p>
                </div>
                <div className="icon">
                    {icon}
                </div>
            </div>
        </div>
    </div>
  )
}

export default RequestStatus